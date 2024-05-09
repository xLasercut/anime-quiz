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
import { GameChatSerialiser } from './game-state/chat';
import { DatabaseDataState } from './database/common';
import { BotMessageDb } from './database/bot-message';
import { SongStatsDb } from './database/song-stats';
import { Logger } from 'winston';
import { TServerConfig } from './models/types';

interface TEmitterDependencies {
  userDb: UserDb;
  songDb: SongDb;
  animeDb: AnimeDb;
  emojiDb: EmojiDb;
  userSongDb: UserSongDb;
  botMessageDb: BotMessageDb;
  songStatsDb: SongStatsDb;
  gameRooms: GameRooms;
  chatSerialiser: GameChatSerialiser;
  dbDataState: DatabaseDataState;
}

interface THandlerDependencies {
  io: Server;
  logger: Logger;
  config: TServerConfig;
  dbDataState: DatabaseDataState;
  userDb: UserDb;
  songDb: SongDb;
  animeDb: AnimeDb;
  emitter: Emitter;
  oidc: Oidc;
  dbLock: DatabaseLock;
  emojiDb: EmojiDb;
  userSongDb: UserSongDb;
  gameRooms: GameRooms;
  botMessageDb: BotMessageDb;
  songStatsDb: SongStatsDb;
  chatSerialiser: GameChatSerialiser;
}

export type { THandlerDependencies, TEmitterDependencies };
