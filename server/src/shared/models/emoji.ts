import { z } from 'zod';

const EmojiId = z
  .string()
  .trim()
  .min(1)
  .regex(/^emoji-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);

const EmojiType = z.union([z.literal('img'), z.literal('dec')]);

const EmojiCommand = z
  .string()
  .trim()
  .min(1)
  .toLowerCase()
  .regex(/^[a-z]+$/);

const EmojiSrc = z.string().trim().min(1);

const Emoji = z.object({
  emojiId: EmojiId,
  src: EmojiSrc,
  type: EmojiType,
  command: EmojiCommand
});

export { EmojiId, EmojiType, EmojiCommand, EmojiSrc, Emoji };
