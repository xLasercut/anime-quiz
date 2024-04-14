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
import { AnimeThemesResponseAnimeTheme, AnimeThemesResponseVideo } from './anime-themes';

type TClientData = z.infer<typeof ClientData>;
type TNotificationColor = z.infer<typeof NotificationColor>;
type TSystemNotification = z.infer<typeof SystemNotification>;
type TAvatar = z.infer<typeof Avatar>;
type TDisplayName = z.infer<typeof DisplayName>;
type TSongType = z.infer<typeof SongType>;
type TSongTitle = z.infer<typeof SongTitle>;
type TAnimeName = z.infer<typeof AnimeName>;
type TAnimeId = z.infer<typeof AnimeId>;
type TSong = z.infer<typeof Song>;
type TAnime = z.infer<typeof Anime>;
type TSongId = z.infer<typeof SongId>;
type TUser = z.infer<typeof User>;
type TUserId = z.infer<typeof UserId>;
type TDiscordId = z.infer<typeof DiscordId>;
type TEmoji = z.infer<typeof Emoji>;
type TEmojiId = z.infer<typeof EmojiId>;
type TEmojiCommand = z.infer<typeof EmojiCommand>;
type TEmojiType = z.infer<typeof EmojiType>;
type TGameRoomId = z.infer<typeof GameRoomId>;
type TGameChat = z.infer<typeof GameChat>;
type TGameChatText = z.infer<typeof GameChatText>;
type TClientLoginAuth = z.infer<typeof ClientLoginAuth>;
type TGameRoomSettings = z.infer<typeof GameRoomSettings>;
type TGameRoomSettingSongCount = z.infer<typeof GameRoomSettingSongCount>;
type TGameRoomSettingsGuessTime = z.infer<typeof GameRoomSettingsGuessTime>;
type TGameRoomSettingsLoadTime = z.infer<typeof GameRoomSettingsLoadTime>;
type TGameRoomSettingsGameMode = z.infer<typeof GameRoomSettingsGameMode>;
type TGameGuess = z.infer<typeof GameGuess>;
type TGameScore = z.infer<typeof GameScore>;
type TGamePlayer = z.infer<typeof GamePlayer>;
type TGameRoomState = z.infer<typeof GameRoomState>;
type TSocketId = z.infer<typeof SocketId>;
type TBotMessage = z.infer<typeof BotMessage>;
type TMessageCommand = z.infer<typeof MessageCommand>;
type TSongStats = z.infer<typeof SongStats>;
type TSongStatsPlayCount = z.infer<typeof SongStatsPlayCount>;
type TSongStatsRecords = z.infer<typeof SongStatsRecords>;
type TCombinedSongStats = z.infer<typeof CombinedSongStats>;
type TGamePlayerLifeLineType = z.infer<typeof GamePlayerLifeLineType>;
type TAnimeThemesResponseAnimeTheme = z.infer<typeof AnimeThemesResponseAnimeTheme>;
type TAnimeThemesResponseVideo = z.infer<typeof AnimeThemesResponseVideo>;

export type {
  TClientData,
  TNotificationColor,
  TSystemNotification,
  TAvatar,
  TDisplayName,
  TSongType,
  TSongTitle,
  TAnimeName,
  TAnimeId,
  TSong,
  TAnime,
  TSongId,
  TUser,
  TUserId,
  TDiscordId,
  TEmoji,
  TEmojiId,
  TEmojiCommand,
  TEmojiType,
  TGameRoomId,
  TGameChat,
  TGameChatText,
  TClientLoginAuth,
  TGameRoomSettings,
  TGameRoomSettingSongCount,
  TGameRoomSettingsGuessTime,
  TGameRoomSettingsLoadTime,
  TGameRoomSettingsGameMode,
  TGameGuess,
  TGameScore,
  TGamePlayer,
  TGameRoomState,
  TSocketId,
  TBotMessage,
  TMessageCommand,
  TSongStats,
  TSongStatsPlayCount,
  TSongStatsRecords,
  TCombinedSongStats,
  TGamePlayerLifeLineType,
  TAnimeThemesResponseAnimeTheme,
  TAnimeThemesResponseVideo
};
