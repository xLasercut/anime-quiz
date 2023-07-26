import { Logger } from './app/logging/logger';
import { Oidc } from './app/oidc';
import { UserDb } from './database/user';
import { Emitter } from './emitters/emitter';

interface LogTemplate {
  level: string;
  message: string;
}

interface HandlerDependencies {
  logger: Logger;
  config: ServerConfig;
  oidc: Oidc;
  userDb: UserDb;
  emitter: Emitter;
}

interface ServerConfig {
  rootDir: string;
  logDir: string;
  dataDir: string;
  dataBackupDir: string;
  mainDbPath: string;
  serverPort: string;
  corsConfig: string;
  clientAuthDelay: number;
  userDbPath: string;
  dbBackupSchedule: string;
  dbBackupCount: number;
  redirectUrl: string;
  discordClientId: string;
  discordClientSecret: string;
}

export { LogTemplate, HandlerDependencies, ServerConfig };
