import { createServer } from 'http';
import { Oidc } from './app/oidc';
import { SERVER_CONFIG } from './app/config';
import { EmitterDependencies, HandlerDependencies } from './interfaces';
import { Server } from './app/server';
import { UserDb } from './database/user';
import { Socket } from './types';
import { SocketData } from './app/socket-data';
import { SOCKET_EVENTS } from './shared/events';
import { Emitter } from './emitters/emitter';
import { newIoErrorHandler, newSocketErrorHandler } from './app/exceptions';
import { SongDb } from './database/song';
import { EntryPointHandler } from './handlers/entry';
import { AnimeDb } from './database/anime';
import { DatabaseLock } from './database/lock';
import { EmojiDb } from './database/emoji';
import { UserSongDb } from './database/user-song';
import { GameRooms } from './game-state/room';
import { Logger } from './app/logger';
import { GameRoomId } from './shared/models/game';
import { GameRoomIdType } from './shared/models/types';
import { GameChatSerialiser } from './game-state/chat';
import { DatabaseDataState } from './database/common';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: SERVER_CONFIG.corsConfig
  }
});
const logger = new Logger(SERVER_CONFIG);
const oidc = new Oidc(SERVER_CONFIG, logger);

const dbLock = new DatabaseLock();
const dbDataState = new DatabaseDataState();
const userDb = new UserDb(SERVER_CONFIG, logger, dbDataState);
const songDb = new SongDb(SERVER_CONFIG, logger, dbDataState);
const animeDb = new AnimeDb(SERVER_CONFIG, logger, songDb, dbDataState);
const emojiDb = new EmojiDb(SERVER_CONFIG, logger, dbDataState);
const userSongDb = new UserSongDb(SERVER_CONFIG, logger, dbDataState);
const gameRooms = new GameRooms(io, logger);
const emitterDependencies: EmitterDependencies = {
  userDb: userDb,
  animeDb: animeDb,
  songDb: songDb,
  emojiDb: emojiDb,
  userSongDb: userSongDb,
  gameRooms: gameRooms,
  chatSerialiser: new GameChatSerialiser(logger),
  dbDataState: dbDataState
};
const emitter = new Emitter(io, emitterDependencies);
const handlerDependencies: HandlerDependencies = {
  logger: logger,
  config: SERVER_CONFIG,
  dbDataState: dbDataState,
  userDb: userDb,
  songDb: songDb,
  animeDb: animeDb,
  emitter: emitter,
  oidc: oidc,
  dbLock: dbLock,
  emojiDb: emojiDb,
  userSongDb: userSongDb,
  io: io,
  gameRooms: gameRooms
};

const ioErrHandler = newIoErrorHandler(logger);

io.on(SOCKET_EVENTS.CONNECT, (socket: Socket) => {
  logger.info('client connected', { id: socket.id });
  const socketErrHandler = newSocketErrorHandler(logger, socket, emitter);
  socket.data = new SocketData(socket, logger);
  const entryHandler = new EntryPointHandler(socket, socketErrHandler, handlerDependencies);
  entryHandler.start();
});

io.of('/').adapter.on(
  'create-room',
  ioErrHandler((_roomId: string) => {
    const roomId = parseGameRoomId(_roomId);
    if (roomId) {
      gameRooms.newRoom(roomId);
      emitter.updateRoomList();
    }
  })
);

io.of('/').adapter.on(
  'delete-room',
  ioErrHandler((_roomId: string) => {
    const roomId = parseGameRoomId(_roomId);
    if (roomId) {
      gameRooms.deleteRoom(roomId);
      emitter.updateRoomList();
    }
  })
);

io.of('/').adapter.on(
  'join-room',
  ioErrHandler((_roomId: string, sid: string) => {
    const socket = io.sockets.sockets.get(sid) as Socket;
    logger.info('joined room', {
      clientData: socket.data.clientData,
      roomId: _roomId,
      sid: sid
    });
    const roomId = parseGameRoomId(_roomId);
    if (roomId) {
      emitter.updateGameChatSys(`${socket.data.clientData.displayName} joined the room`, roomId);
      emitter.updateStorePlayerList(roomId);
    }
  })
);

io.of('/').adapter.on(
  'leave-room',
  ioErrHandler((_roomId: string, sid: string) => {
    const socket = io.sockets.sockets.get(sid) as Socket;
    logger.info('left room', {
      clientData: socket.data.clientData,
      roomId: _roomId,
      sid: sid
    });
    const roomId = parseGameRoomId(_roomId);
    if (roomId) {
      emitter.updateGameChatSys(`${socket.data.clientData.displayName} left the room`, roomId);
      const hostSocket = gameRooms.setNewHost(roomId);
      if (hostSocket) {
        emitter.updateStoreClientData(hostSocket.data.clientData, hostSocket.id);
      }
      emitter.updateStorePlayerList(roomId);
    }
  })
);

httpServer.listen(SERVER_CONFIG.serverPort, () => {
  logger.info('server started', { port: SERVER_CONFIG.serverPort, corsConfig: SERVER_CONFIG.corsConfig });
});

function parseGameRoomId(roomId: string): false | GameRoomIdType {
  try {
    return GameRoomId.parse(roomId);
  } catch {
    return false;
  }
}
