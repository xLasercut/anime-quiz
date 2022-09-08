import * as Joi from 'joi';
import { songIdSchema } from './song';

const userIdSchema = Joi.string()
  .trim()
  .pattern(/^user-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
  .required()
  .label('User ID');

const usernameSchema = Joi.string().trim().required().label('Username');

const userSchema = Joi.object({
  user_id: userIdSchema,
  username: usernameSchema,
  song_id: Joi.array().items(songIdSchema).required().label('Song IDs')
})
  .label('User')
  .meta({ className: 'IUserSongs' });

const userRawSchema = Joi.object({
  user_id: userIdSchema,
  song_id: Joi.string().trim().required().label('Song ID'),
  username: usernameSchema
})
  .label('User Raw')
  .meta({ className: 'IUserSongsRaw' });

export { userSchema, userRawSchema };
