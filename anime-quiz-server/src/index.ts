import { createServer } from 'http';
import { Oidc } from './app/oidc';
import { Logger } from './app/logging/logger';
import { SERVER_CONFIG } from './app/config';
import { LOG_REFERENCES } from './app/logging/constants';
import { HandlerDependencies } from './interfaces';
import { OidcHandler } from './handlers/authentication';
import { Server } from './app/server';
import { UserDb } from './database/user';
import { Socket } from './types';
import { SocketData } from './app/socket-data';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: SERVER_CONFIG.corsConfig
  }
});
const oidc = new Oidc(SERVER_CONFIG);
const logger = new Logger(SERVER_CONFIG);
const userDb = new UserDb(SERVER_CONFIG, logger);
const handlerDependencies = Object.freeze<HandlerDependencies>({
  logger: logger,
  config: SERVER_CONFIG,
  oidc: oidc,
  userDb: userDb
});

io.on('connection', (socket: Socket) => {
  logger.writeLog(LOG_REFERENCES.CLIENT_CONNECTED, { id: socket.id });
  socket.data = new SocketData();
  const oidcHandler = new OidcHandler(socket, handlerDependencies);
  oidcHandler.start();

  socket.on('disconnect', async () => {
    logger.writeLog(LOG_REFERENCES.CLIENT_DISCONNECTED, { id: socket.id });
  });
});

httpServer.listen(SERVER_CONFIG.serverPort, async () => {
  logger.writeLog(LOG_REFERENCES.SERVER_START, {
    port: SERVER_CONFIG.serverPort,
    corsConfig: SERVER_CONFIG.corsConfig
  });
});
