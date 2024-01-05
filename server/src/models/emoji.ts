import { z } from 'zod';
import { EmojiCommand, EmojiId, EmojiSrc, EmojiType } from '../shared/models/emoji';

const DbEmoji = z.object({
  command: EmojiCommand,
  emoji_id: EmojiId,
  src: EmojiSrc,
  type: EmojiType
});

export { DbEmoji };
