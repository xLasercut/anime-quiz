import { z } from 'zod';
import { Avatar, DisplayName, UserId } from './user';
import { GameChatText } from './game';

const MessageId = z
  .string()
  .trim()
  .min(1)
  .regex(/^message-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);

const MessageCommand = z
  .string()
  .trim()
  .min(1)
  .toLowerCase()
  .regex(/^[a-z ']+$/);

const BotMessage = z.object({
  messageId: MessageId,
  command: MessageCommand,
  avatar: Avatar,
  text: GameChatText,
  displayName: DisplayName,
  userId: UserId
});

export { MessageId, BotMessage, MessageCommand };
