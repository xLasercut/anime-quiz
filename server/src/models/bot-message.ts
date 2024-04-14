import { z } from 'zod';
import { Avatar, DisplayName, UserId } from 'anime-quiz-shared-resources/src/models/user';
import { GameChatText } from 'anime-quiz-shared-resources/src/models/game';
import { MessageCommand, MessageId } from 'anime-quiz-shared-resources/src/models/bot-message';

const DbBotMessage = z.object({
  message_id: MessageId,
  command: MessageCommand,
  avatar: Avatar,
  text: GameChatText,
  display_name: DisplayName,
  user_id: UserId
});

export { DbBotMessage };
