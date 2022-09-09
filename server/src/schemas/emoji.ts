import * as Joi from 'joi';
import { VALID_EMOJI_TYPES } from '../shared/constants/emoji-types';

const emojiIdSchema = Joi.string()
  .trim()
  .pattern(/^emoji-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
  .required()
  .label('Emoji ID');

const emojiCommandSchema = Joi.string()
  .trim()
  .lowercase()
  .pattern(/^[0-9a-zA-Z]+$/)
  .required()
  .label('Emoji Command');

const emojiTypeSchema = Joi.string()
  .trim()
  .valid(...VALID_EMOJI_TYPES)
  .required()
  .label('Emoji Type')
  .meta({ className: 'IEmojiType' });

const emojiSchema = Joi.object({
  emoji_id: emojiIdSchema,
  command: emojiCommandSchema,
  src: Joi.string().trim().required().label('Emoji Src'),
  type: emojiTypeSchema
})
  .label('Emoji')
  .meta({ className: 'IEmoji' });

export { emojiSchema, emojiTypeSchema };
