import * as Joi from 'joi';
import { songSchema } from './song';
import { VALID_AVATARS } from '../shared/constants/avatars';
import { VALID_COLORS } from '../shared/constants/colors';
import { VALID_GAME_MODES } from '../shared/constants/game-modes';
import { USERNAME_FORMAT } from '../shared/constants/formats';

const gameModeSchema = Joi.string()
  .trim()
  .allow(...Object.values(VALID_GAME_MODES))
  .required()
  .label('Game Mode')
  .meta({ className: 'IGameMode' });

const gameSettingsSchema = Joi.object({
  songCount: Joi.number().required().label('Song Count'),
  guessTime: Joi.number().required().label('Guess Time'),
  gameMode: gameModeSchema,
  duplicate: Joi.boolean().required().label('Duplicate'),
  users: Joi.array().items(Joi.string().trim().label('User')).min(0).required().label('Users')
})
  .label('Game Settings')
  .meta({ className: 'IGameSettings' });

const gameGuessSchema = Joi.object({
  anime: Joi.string().trim().allow('', null).empty(null).default(''),
  title: Joi.string().trim().allow('', null).empty(null).default('')
})
  .label('Game Guess')
  .meta({ className: 'IGameGuess' });

const gameStateSchema = Joi.object({
  currentSongCount: Joi.number().required().label('Current Song Count'),
  maxSongCount: Joi.number().required().label('Max Song Count'),
  playing: Joi.boolean().required().label('Playing'),
  currentSong: songSchema.required()
})
  .label('Game State')
  .meta({ className: 'IGameState' });

const gameAvatarSchema = Joi.string()
  .trim()
  .allow(...VALID_AVATARS)
  .required()
  .label('Avatar')
  .meta({ className: 'IGameAvatar' });

const gameChatMessageSchema = Joi.object({
  username: Joi.string().trim().required().label('Username'),
  text: Joi.string().trim().required().label('Text'),
  avatar: gameAvatarSchema,
  sid: Joi.string().trim().required().label('SID'),
  repeat: Joi.boolean().required().label('Repeat'),
  admin: Joi.boolean().required().label('Admin')
})
  .label('Game Chat Message')
  .meta({ className: 'IGameChatMessage' });

const gameUsernameSchema = Joi.string()
  .trim()
  .pattern(USERNAME_FORMAT)
  .required()
  .label('Username');

const gameClientSchema = Joi.object({
  username: gameUsernameSchema,
  avatar: gameAvatarSchema,
  admin: Joi.boolean().required().label('Admin'),
  host: Joi.boolean().required().label('Host')
})
  .label('Game Client data')
  .meta({ className: 'IClientData' });

const gameLoginSchema = Joi.object({
  username: gameUsernameSchema,
  avatar: gameAvatarSchema
})
  .label('Game Login data')
  .meta({ className: 'IGameLoginData' });

const gameNotificationColorSchema = Joi.string()
  .trim()
  .allow(...VALID_COLORS)
  .required()
  .label('Score Color')
  .meta({ className: 'INotificationColor' });

const gamePlayerSchema = Joi.object({
  username: Joi.string().trim().required().label('Username'),
  avatar: gameAvatarSchema,
  admin: Joi.boolean().required().label('Admin'),
  host: Joi.boolean().required().label('Host'),
  score: Joi.number().required().label('Score'),
  guess: gameGuessSchema.required(),
  scoreColor: gameNotificationColorSchema,
  sid: Joi.string().trim().required().label('SID')
})
  .label('Game Player data')
  .meta({ className: 'IGamePlayer' });

export {
  gameSettingsSchema,
  gameGuessSchema,
  gameStateSchema,
  gameChatMessageSchema,
  gameAvatarSchema,
  gameClientSchema,
  gameNotificationColorSchema,
  gamePlayerSchema,
  gameModeSchema,
  gameLoginSchema
};
