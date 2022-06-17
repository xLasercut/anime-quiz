import { Socket } from '../types';
import { ServerConfig } from './config';
import { Logger } from './logging/logger';
import { LOG_BASE } from './logging/log-base';
import { AVATARS, USERNAME_FORMAT } from '../shared/constants';

function isValidPassword(password: string, config: ServerConfig): boolean {
  return password === config.serverPassword || password === config.adminPassword;
}

function isAdminPassword(password: string, config: ServerConfig): boolean {
  return password === config.adminPassword;
}

function isValidUsername(username: string): boolean {
  return USERNAME_FORMAT.test(username);
}

function isValidAvatar(avatar: string): boolean {
  return Object.values(AVATARS).includes(avatar);
}

function authenticateUser(
  socket: Socket,
  username: string,
  password: string,
  avatar: string,
  config: ServerConfig
): void {
  const validUsername = isValidUsername(username);
  const validPassword = isValidPassword(password, config);
  const validAvatar = isValidAvatar(avatar);
  const validAdmin = isAdminPassword(password, config);
  if (validUsername && validPassword && validAvatar) {
    socket.data.userLogin(username, avatar);
    socket.data.auth = true;
  }
  if (validAdmin) {
    socket.data.admin = true;
  }
}

function checkClientAuth(logger: Logger, socket: Socket): void {
  if (!socket.data.auth) {
    logger.writeLog(LOG_BASE.UNAUTHORISED_CLIENT, { id: socket.id });
    socket.disconnect();
  }
}

export { authenticateUser, checkClientAuth };
