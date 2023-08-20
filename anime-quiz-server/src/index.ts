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

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: SERVER_CONFIG.corsConfig
  }
});
const logger = new Logger(SERVER_CONFIG);
const oidc = new Oidc(SERVER_CONFIG, logger);

const dbLock = new DatabaseLock();
const userDb = new UserDb(SERVER_CONFIG, logger);
const songDb = new SongDb(SERVER_CONFIG, logger);
const animeDb = new AnimeDb(SERVER_CONFIG, logger, songDb);
const emojiDb = new EmojiDb(SERVER_CONFIG, logger);
const userSongDb = new UserSongDb(SERVER_CONFIG, logger);
const gameRooms = new GameRooms(io, logger);
const emitterDependencies: EmitterDependencies = {
  userDb: userDb,
  animeDb: animeDb,
  songDb: songDb,
  emojiDb: emojiDb,
  userSongDb: userSongDb,
  gameRooms: gameRooms,
  chatSerialiser: new GameChatSerialiser(logger)
};
const emitter = new Emitter(io, emitterDependencies);
const handlerDependencies: HandlerDependencies = {
  logger: logger,
  config: SERVER_CONFIG,
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
    const roomId = parseGameRoomId(_roomId);
    if (roomId) {
      gameRooms.addPlayer(roomId, sid);
    }
  })
);

io.of('/').adapter.on(
  'leave-room',
  ioErrHandler((_roomId: string, sid: string) => {
    const roomId = parseGameRoomId(_roomId);
    if (roomId) {
      gameRooms.deletePlayer(roomId, sid);
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
