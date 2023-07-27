import { createServer } from 'http';
import { Oidc } from './app/oidc';
import { Logger } from './app/logging/logger';
import { SERVER_CONFIG } from './app/config';
import { LOG_REFERENCES } from './app/logging/constants';
import { HandlerDependencies } from './interfaces';
import { Server } from './app/server';
import { UserDb } from './database/user';
import { Socket } from './types';
import { SocketData } from './app/socket-data';
import { SOCKET_EVENTS } from './shared/events';
import { Emitter } from './emitters/emitter';
import { newSocketErrorHandler, UnauthorizedError } from './app/exceptions';
import { startHandler } from './handlers/init';
import { ClientData } from './shared/models/client';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: SERVER_CONFIG.corsConfig
  }
});
const oidc = new Oidc(SERVER_CONFIG);
const logger = new Logger(SERVER_CONFIG);
const emitter = new Emitter(io);
const userDb = new UserDb(SERVER_CONFIG, logger);
const handlerDependencies: HandlerDependencies = {
  logger: logger,
  config: SERVER_CONFIG,
  oidc: oidc,
  userDb: userDb,
  emitter: emitter
};

io.on(SOCKET_EVENTS.CONNECT, (socket: Socket) => {
  logger.writeLog(LOG_REFERENCES.CLIENT_CONNECTED, { id: socket.id });
  const socketErrHandler = newSocketErrorHandler(logger, socket, emitter);
  socket.data = new SocketData();
  socket.data.clientAuthTimer = setTimeout(
    socketErrHandler(() => {
      checkClientAuth(socket);
    }),
    SERVER_CONFIG.clientAuthDelay
  );

  socket.on(
    SOCKET_EVENTS.AUTHORIZE_USER,
    socketErrHandler(async (code: string, callback: Function) => {
      const discordUser = await oidc.getUserInfo(code);
      userDb.validateAllowedUser(discordUser.id);
      const dbUser = userDb.getUserInfo(discordUser.id);
      socket.data.initClientData(dbUser);
      emitter.updateStoreClientData(socket.data.clientData, socket.id);
      startHandler(socket, socketErrHandler, handlerDependencies);
      callback(true);
    })
  );

  socket.on(
    SOCKET_EVENTS.DISCONNECT,
    socketErrHandler(() => {
      logger.writeLog(LOG_REFERENCES.CLIENT_DISCONNECTED, { id: socket.id });
      clearTimeout(socket.data.clientAuthTimer);
    })
  );
});

httpServer.listen(SERVER_CONFIG.serverPort, async () => {
  logger.writeLog(LOG_REFERENCES.SERVER_START, {
    port: SERVER_CONFIG.serverPort,
    corsConfig: SERVER_CONFIG.corsConfig
  });
});

function checkClientAuth(socket: Socket) {
  if (!socket.data.clientData.auth) {
    throw new UnauthorizedError();
  }
}
