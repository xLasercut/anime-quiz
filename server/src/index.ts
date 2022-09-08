import { createServer } from 'http';
import { ServerConfig } from './app/config';
import { Logger } from './app/logging/logger';
import { newIoErrorHandler, newSocketErrorHandler } from './app/exceptions';
import { SocketData } from './app/socket-data';
import { ISocket } from './types';
import { LOG_BASE } from './app/logging/log-base';
import { SHARED_EVENTS } from './shared/events';
import { authenticateUser, checkClientAuth } from './app/authentication';
import { SongListHandler } from './handlers/song-list';
import { RoomHandler } from './handlers/room';
import { UserDb } from './database/user';
import { GameHandler } from './handlers/game';
import { GameSettingsDb } from './game/settings';
import { isGameRoom } from './helpers';
import { Server } from './app/server';
import { GameSettingsHandler } from './handlers/settings';
import { GameStatesDb } from './game/state';
import { AnimeEditHandler } from './handlers/anime-edit';
import { SongEditHandler } from './handlers/song-edit';
import { AdminHandler } from './handlers/admin';
import { EmojiEditHandler } from './handlers/emoji-edit';
import { EmojiDb } from './database/emoji';
import { SongDb } from './database/song';
import { UserEditHandler } from './handlers/user-edit';
import { DataHandler } from './handlers/data';
import { SystemEmitter } from './emitters/system';
import { RoomEmitter } from './emitters/room';
import { GameEmitter } from './emitters/game';
import { IGameAvatar } from './shared/interfaces';
import { ERROR } from './shared/constants/colors';
import { GameLoginData } from './models/game';

const config = new ServerConfig();
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: config.corsConfig
  }
});

const logger = new Logger(config);
const userDb = new UserDb(config, logger);
const emojiDb = new EmojiDb(config, logger);
const songDb = new SongDb(config, logger);
const settingsDb = new GameSettingsDb(logger);
const statesDb = new GameStatesDb(logger, io);

const systemEmitter = new SystemEmitter(io);
const roomEmitter = new RoomEmitter(io);
const gameEmitter = new GameEmitter(io, logger, settingsDb, statesDb);

const ioErrorHandler = newIoErrorHandler(logger);

const dataHandler = new DataHandler(io, logger, userDb, songDb, emojiDb);

const animeEditHandler = new AnimeEditHandler(io, logger, songDb);
const songEditHandler = new SongEditHandler(io, logger, songDb, userDb);
const adminHandler = new AdminHandler(logger, io, songDb, emojiDb, userDb, statesDb);
const emojiEditHandler = new EmojiEditHandler(io, logger, emojiDb);
const userEditHandler = new UserEditHandler(io, logger, userDb);

const songListHandler = new SongListHandler(io, logger, songDb, userDb);
const roomHandler = new RoomHandler(logger, roomEmitter);
const gameSettingsHandler = new GameSettingsHandler(logger, settingsDb, gameEmitter);
const gameHandler = new GameHandler(io, logger, settingsDb, statesDb, userDb, songDb, emojiDb);

function startHandlers(socket: ISocket, errorHandler: Function): void {
  if (socket.data.auth) {
    songListHandler.start(socket, errorHandler);
    roomHandler.start(socket, errorHandler);
    gameHandler.start(socket, errorHandler);
    gameSettingsHandler.start(socket, errorHandler);
    dataHandler.start(socket, errorHandler);
    if (socket.data.admin) {
      animeEditHandler.start(socket, errorHandler);
      songEditHandler.start(socket, errorHandler);
      adminHandler.start(socket, errorHandler);
      emojiEditHandler.start(socket, errorHandler);
      userEditHandler.start(socket, errorHandler);
    }
    systemEmitter.updateClientData(socket.data.getClientData(), socket.id);
  }
}

io.on('connection', (socket: ISocket) => {
  logger.writeLog(LOG_BASE.NEW_CONNECTION, { id: socket.id });
  const errorHandler = newSocketErrorHandler(socket, logger, systemEmitter);
  socket.data = new SocketData(socket.id);
  socket.data.clientAuthTimer = setTimeout((): void => {
    checkClientAuth(logger, socket);
  }, config.clientAuthDelay);

  socket.on(
    SHARED_EVENTS.AUTHENTICATE,
    (username: string, password: string, avatar: IGameAvatar, callback: Function) => {
      try {
        const loginData = new GameLoginData({ username, avatar }).dict();
        authenticateUser(socket, loginData, password, config);
        startHandlers(socket, errorHandler);
        if (!socket.data.auth) {
          systemEmitter.systemNotification(ERROR, 'Incorrect server password', socket.id);
        }
        callback(socket.data.auth);
      } catch (e) {
        errorHandler(e);
        callback(false);
      }
    }
  );

  socket.on('disconnect', async () => {
    try {
      logger.writeLog(LOG_BASE.CLIENT_DISCONNECTED, { id: socket.id });
      clearTimeout(socket.data.clientAuthTimer);
    } catch (e) {
      errorHandler(e);
    }
  });
});

io.of('/').adapter.on('create-room', (roomId: string) => {
  try {
    if (isGameRoom(roomId)) {
      settingsDb.addRoom(roomId);
      statesDb.addRoom(roomId);
      roomEmitter.updateRoomList();
    }
  } catch (e) {
    ioErrorHandler(e);
  }
});

io.of('/').adapter.on('delete-room', (roomId: string) => {
  try {
    if (isGameRoom(roomId)) {
      settingsDb.deleteRoom(roomId);
      statesDb.deleteRoom(roomId);
      roomEmitter.updateRoomList();
    }
  } catch (e) {
    ioErrorHandler(e);
  }
});

io.of('/').adapter.on('join-room', (roomId: string, sid: string) => {
  try {
    const socket = io.sockets.sockets.get(sid);
    logger.writeLog(LOG_BASE.JOINED_ROOM, {
      id: sid,
      username: socket.data.username,
      roomId: roomId
    });
    if (isGameRoom(roomId)) {
      gameEmitter.updateGamePlayerList(roomId, roomId);
      gameEmitter.updateGameState(roomId, sid);
      gameEmitter.updateGameChatSys(`${socket.data.username} joined the room`, roomId);
    }
  } catch (e) {
    ioErrorHandler(e);
  }
});

io.of('/').adapter.on('leave-room', (roomId: string, sid: string) => {
  try {
    const socket = io.sockets.sockets.get(sid);
    logger.writeLog(LOG_BASE.LEAVE_ROOM, {
      id: sid,
      username: socket.data.username,
      roomId: roomId
    });
    if (isGameRoom(roomId)) {
      io.reassignHost(roomId);
      gameEmitter.updateGamePlayerList(roomId, roomId);
      gameEmitter.updateGameChatSys(`${socket.data.username} left the room`, roomId);
    }
  } catch (e) {
    ioErrorHandler(e);
  }
});

httpServer.listen(config.serverPort, async () => {
  try {
    logger.writeLog(LOG_BASE.SERVER_RUNNING, { port: config.serverPort });
    await userDb.startBackTask();
  } catch (e) {
    throw e;
  }
});
