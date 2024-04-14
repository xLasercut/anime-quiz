import { z } from 'zod';
import { Admin, Avatar, DisplayName, UserId } from './user';
import { GAME_MODES } from '../game-modes';
import { ClientData, NotificationColor } from './client';
import { Song, SongType } from './song';

const GameRoomId = z
  .string()
  .trim()
  .min(1)
  .regex(/^amq-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\|[A-Za-z0-9-_ ]{1,30}$/);

const GameChatText = z.string().trim().min(1);

const GameChat = z.object({
  displayName: DisplayName,
  admin: Admin,
  userId: UserId,
  avatar: Avatar,
  repeat: z.boolean(),
  text: GameChatText
});

const GameRoomSettingSongCount = z.number().gte(1).lte(100);
const GameRoomSettingsGuessTime = z.number().gte(5).lte(120);

const GameRoomSettingsLoadTime = z.number().gte(5).lte(60);
const GameRoomSettingsGameMode = z
  .string()
  .trim()
  .refine(
    (val) => {
      return Object.values(GAME_MODES).includes(val);
    },
    {
      message: 'Invalid game mode'
    }
  );

const GameRoomSettingsSongType = z.array(SongType);
const GameRoomSettings = z.object({
  songCount: GameRoomSettingSongCount,
  guessTime: GameRoomSettingsGuessTime,
  loadTime: GameRoomSettingsLoadTime,
  duplicate: z.boolean(),
  gameMode: GameRoomSettingsGameMode,
  songType: GameRoomSettingsSongType,
  leastPlayed: z.boolean()
});

const GameGuess = z.object({
  anime: z.string().trim(),
  title: z.string().trim()
});

const GameScore = z.number();

const GamePlayer = z.intersection(
  ClientData,
  z.object({
    guess: GameGuess,
    score: GameScore,
    scoreColor: NotificationColor,
    skipSong: z.boolean()
  })
);

const GamePlayerLifeLineType = z.union([z.literal('ANIME_HINT'), z.literal('SONG_HINT')]);

const GameRoomState = z.object({
  currentSong: Song,
  currentSongCount: z.number(),
  maxSongCount: z.number(),
  playing: z.boolean()
});

export {
  GameRoomId,
  GameChat,
  GameChatText,
  GameRoomSettings,
  GameRoomSettingSongCount,
  GameRoomSettingsGuessTime,
  GameRoomSettingsGameMode,
  GameGuess,
  GameScore,
  GamePlayer,
  GameRoomState,
  GameRoomSettingsSongType,
  GameRoomSettingsLoadTime,
  GamePlayerLifeLineType
};
