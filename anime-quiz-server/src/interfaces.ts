import { Logger } from './app/logging/logger';
import { UserDb } from './database/user';
import { Emitter } from './emitters/emitter';
import { SongDb } from './database/song';
import { Oidc } from './app/oidc';
import { AnimeDb } from './database/anime';
import { DatabaseLock } from './database/lock';
import { EmojiDb } from './database/emoji';

interface LogTemplate {
  level: string;
  message: string;
}

interface HandlerDependencies {
  logger: Logger;
  config: ServerConfig;
  userDb: UserDb;
  songDb: SongDb;
  animeDb: AnimeDb;
  emitter: Emitter;
  oidc: Oidc;
  dbLock: DatabaseLock;
  emojiDb: EmojiDb;
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
  logLevel: string;
  discordUserOverride: string;
}

export { LogTemplate, HandlerDependencies, ServerConfig };
