import { z } from 'zod';
import { Admin, Avatar, DisplayName, User, UserId } from './user';
import { GAME_MODES } from '../game-modes';
import {ClientData} from "./client";

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

const GameRoomSettings = z.object({
  songCount: GameRoomSettingSongCount,
  guessTime: GameRoomSettingsGuessTime,
  duplicate: z.boolean(),
  gameMode: GameRoomSettingsGameMode
});

const GameGuess = z.object({
  anime: z.string().trim(),
  title: z.string().trim()
});

const GameScore = z.number()

const GamePlayer = z.intersection(
  ClientData,
  z.object({
    guess: GameGuess,
    score: GameScore
  })
);

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
  GamePlayer
};
