import { z } from 'zod';
import {Admin, Avatar, DisplayName, UserId} from './user';

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

export { GameRoomId, GameChat, GameChatText };
