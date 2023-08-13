import { UserDb } from './database/user';
import { Emitter } from './emitters/emitter';
import { SongDb } from './database/song';
import { Oidc } from './app/oidc';
import { AnimeDb } from './database/anime';
import { DatabaseLock } from './database/lock';
import { EmojiDb } from './database/emoji';
import { UserSongDb } from './database/user-song';
import { Server } from './app/server';
import { GameRooms } from './game-state/room';
import { Logger } from './app/logger';

interface EmitterDependencies {
  userDb: UserDb;
  songDb: SongDb;
  animeDb: AnimeDb;
  emojiDb: EmojiDb;
  userSongDb: UserSongDb;
  gameRooms: GameRooms;
}

interface HandlerDependencies {
  io: Server;
  logger: Logger;
  config: ServerConfig;
  userDb: UserDb;
  songDb: SongDb;
  animeDb: AnimeDb;
  emitter: Emitter;
  oidc: Oidc;
  dbLock: DatabaseLock;
  emojiDb: EmojiDb;
  userSongDb: UserSongDb;
  gameRooms: GameRooms;
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

export { HandlerDependencies, ServerConfig, EmitterDependencies };
