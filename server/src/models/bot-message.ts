import { z } from 'zod';
import { Avatar, DisplayName, UserId } from '../shared/models/user';
import { GameChatText } from '../shared/models/game';
import { MessageCommand, MessageId } from '../shared/models/bot-message';

const DbBotMessage = z.object({
  message_id: MessageId,
  command: MessageCommand,
  avatar: Avatar,
  text: GameChatText,
  display_name: DisplayName,
  user_id: UserId
});

export { DbBotMessage };
