import { z } from 'zod';
import { EmojiCommand, EmojiId, EmojiSrc, EmojiType } from 'anime-quiz-shared-resources';

const DbEmoji = z.object({
  command: EmojiCommand,
  emoji_id: EmojiId,
  src: EmojiSrc,
  type: EmojiType
});

export { DbEmoji };
