import { createServer } from 'http';
import { Oidc } from './app/oidc';
import { Logger } from './app/logging/logger';
import { SERVER_CONFIG } from './app/config';
import { LOG_REFERENCES } from './app/logging/constants';
import { EmitterDependencies, HandlerDependencies } from './interfaces';
import { Server } from './app/server';
import { UserDb } from './database/user';
import { Socket } from './types';
import { SocketData } from './app/socket-data';
import { SOCKET_EVENTS } from './shared/events';
import { Emitter } from './emitters/emitter';
import { newSocketErrorHandler } from './app/exceptions';
import { SongDb } from './database/song';
import { EntryPointHandler } from './handlers/entry';
import { AnimeDb } from './database/anime';
import { DatabaseLock } from './database/lock';
import { EmojiDb } from './database/emoji';
import { UserSongDb } from './database/user-song';
import { GameRooms } from './game-state/room';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: SERVER_CONFIG.corsConfig
  }
});
const oidc = new Oidc(SERVER_CONFIG);
const logger = new Logger(SERVER_CONFIG);

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
  gameRooms: gameRooms
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

io.on(SOCKET_EVENTS.CONNECT, (socket: Socket) => {
  logger.writeLog(LOG_REFERENCES.CLIENT_CONNECTED, { id: socket.id });
  const socketErrHandler = newSocketErrorHandler(logger, socket, emitter);
  socket.data = new SocketData();
  const entryHandler = new EntryPointHandler(socket, socketErrHandler, handlerDependencies);
  entryHandler.start();
});

io.of('/').adapter.on('create-room', (roomId: string) => {

});

io.of('/').adapter.on('delete-room', (roomId: string, sid: string) => {

})

io.of('/').adapter.on('join-room', (roomId: string, sid: string) => {

})

io.of('/').adapter.on('leave-room', (roomId: string, sid: string) => {

})

httpServer.listen(SERVER_CONFIG.serverPort, async () => {
  logger.writeLog(LOG_REFERENCES.SERVER_START, {
    port: SERVER_CONFIG.serverPort,
    corsConfig: SERVER_CONFIG.corsConfig
  });
});
