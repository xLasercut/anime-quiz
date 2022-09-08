import { ISocket } from '../types';
import { ServerConfig } from './config';
import { Logger } from './logging/logger';
import { LOG_BASE } from './logging/log-base';
import { IGameLoginData } from '../shared/interfaces';

function isValidPassword(password: string, config: ServerConfig): boolean {
  return password === config.serverPassword || password === config.adminPassword;
}

function isAdminPassword(password: string, config: ServerConfig): boolean {
  return password === config.adminPassword;
}

function authenticateUser(
  socket: ISocket,
  loginData: IGameLoginData,
  password: string,
  config: ServerConfig
): void {
  const validPassword = isValidPassword(password, config);
  const validAdmin = isAdminPassword(password, config);
  if (validPassword) {
    socket.data.userLogin(loginData);
    socket.data.auth = true;
  }
  if (validAdmin) {
    socket.data.admin = true;
  }
}

function checkClientAuth(logger: Logger, socket: ISocket): void {
  if (!socket.data.auth) {
    logger.writeLog(LOG_BASE.UNAUTHORISED_CLIENT, { id: socket.id });
    socket.disconnect();
  }
}

export { authenticateUser, checkClientAuth };
