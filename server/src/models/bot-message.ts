import { z } from 'zod';
import { Avatar, DisplayName, GameChatText, MessageCommand, MessageId, UserId } from 'anime-quiz-shared-resources';

const DbBotMessage = z.object({
  message_id: MessageId,
  command: MessageCommand,
  avatar: Avatar,
  text: GameChatText,
  display_name: DisplayName,
  user_id: UserId
});

export { DbBotMessage };
