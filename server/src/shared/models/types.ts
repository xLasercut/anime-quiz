import { z } from 'zod';
import { ClientData, ClientLoginAuth, NotificationColor, SocketId, SystemNotification } from './client';
import { Song, SongId, SongTitle, SongType } from './song';
import { Anime, AnimeId, AnimeName } from './anime';
import { Avatar, DiscordId, DisplayName, User, UserId } from './user';
import { Emoji, EmojiCommand, EmojiId, EmojiType } from './emoji';
import {
  GameChat,
  GameChatText,
  GameGuess,
  GamePlayer,
  GamePlayerLifeLineType,
  GameRoomId,
  GameRoomSettings,
  GameRoomSettingsGameMode,
  GameRoomSettingsGuessTime,
  GameRoomSettingsLoadTime,
  GameRoomSettingSongCount,
  GameRoomState,
  GameScore
} from './game';
import { BotMessage, MessageCommand } from './bot-message';
import { CombinedSongStats, SongStats, SongStatsPlayCount, SongStatsRecords } from './song-stats';

export type ClientDataType = z.infer<typeof ClientData>;
export type NotificationColorType = z.infer<typeof NotificationColor>;
export type SystemNotificationType = z.infer<typeof SystemNotification>;
export type AvatarType = z.infer<typeof Avatar>;
export type DisplayNameType = z.infer<typeof DisplayName>;
export type SongTypeType = z.infer<typeof SongType>;
export type SongTitleType = z.infer<typeof SongTitle>;
export type AnimeNameType = z.infer<typeof AnimeName>;
export type AnimeIdType = z.infer<typeof AnimeId>;
export type SongType = z.infer<typeof Song>;
export type AnimeType = z.infer<typeof Anime>;
export type SongIdType = z.infer<typeof SongId>;
export type UserType = z.infer<typeof User>;
export type UserIdType = z.infer<typeof UserId>;
export type DiscordIdType = z.infer<typeof DiscordId>;
export type EmojiType = z.infer<typeof Emoji>;
export type EmojiIdType = z.infer<typeof EmojiId>;
export type EmojiCommandType = z.infer<typeof EmojiCommand>;
export type EmojiTypeType = z.infer<typeof EmojiType>;
export type GameRoomIdType = z.infer<typeof GameRoomId>;
export type GameChatType = z.infer<typeof GameChat>;
export type GameChatTextType = z.infer<typeof GameChatText>;
export type ClientLoginAuthType = z.infer<typeof ClientLoginAuth>;
export type GameRoomSettingsType = z.infer<typeof GameRoomSettings>;
export type GameRoomSettingSongCountType = z.infer<typeof GameRoomSettingSongCount>;
export type GameRoomSettingsGuessTimeType = z.infer<typeof GameRoomSettingsGuessTime>;
export type GameRoomSettingsLoadTimeType = z.infer<typeof GameRoomSettingsLoadTime>;
export type GameRoomSettingsGameModeType = z.infer<typeof GameRoomSettingsGameMode>;
export type GameGuessType = z.infer<typeof GameGuess>;
export type GameScoreType = z.infer<typeof GameScore>;
export type GamePlayerType = z.infer<typeof GamePlayer>;
export type GameRoomStateType = z.infer<typeof GameRoomState>;
export type SocketIdType = z.infer<typeof SocketId>;
export type BotMessageType = z.infer<typeof BotMessage>;
export type MessageCommandType = z.infer<typeof MessageCommand>;
export type SongStatsType = z.infer<typeof SongStats>;
export type SongStatsPlayCountType = z.infer<typeof SongStatsPlayCount>;
export type SongStatsRecordsType = z.infer<typeof SongStatsRecords>;
export type CombinedSongStatsType = z.infer<typeof CombinedSongStats>;
export type GamePlayerLifeLineTypeType = z.infer<typeof GamePlayerLifeLineType>;
