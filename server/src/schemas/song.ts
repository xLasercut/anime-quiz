import * as Joi from 'joi';

import { animeIdSchema, animeNameSchema } from './anime';
import { VALID_SONG_TYPES } from '../shared/constants/song-types';

const songIdSchema = Joi.string()
  .trim()
  .pattern(/^song-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
  .label('Song ID')
  .meta({ className: 'ISongId' });

const songTypeSchema = Joi.string()
  .trim()
  .valid(...VALID_SONG_TYPES)
  .required()
  .label('Song Type')
  .meta({ className: 'ISongType' });

const songTitleSchema = Joi.string().trim().required().label('Song Title');

const songSrcSchema = Joi.string()
  .trim()
  .uri({
    scheme: ['http', 'https']
  })
  .required()
  .label('Song Src');

const newSongSchema = Joi.object({
  anime_name: Joi.array().required().label('Anime Names'),
  anime_id: Joi.array().min(1).items(animeIdSchema).required().label('Anime IDs'),
  song_id: songIdSchema.required(),
  type: songTypeSchema,
  artist: Joi.string().trim().empty('').allow(null).default(null).label('Artist'),
  song_title: songTitleSchema,
  src: songSrcSchema
})
  .label('New Song')
  .meta({ className: 'ISongNew' });

const songSchema = Joi.object({
  anime_name: Joi.array().min(1).items(animeNameSchema).required().label('Anime Names'),
  anime_id: Joi.array().min(1).items(animeIdSchema).required().label('Anime IDs'),
  song_id: songIdSchema.required(),
  type: songTypeSchema,
  artist: Joi.string().trim().empty('').allow(null).default(null).label('Artist'),
  song_title: songTitleSchema,
  src: songSrcSchema
})
  .label('Song')
  .meta({ className: 'ISong' });

const songRawSchema = Joi.object({
  anime_name: Joi.string().trim().required().label('Anime Names'),
  anime_id: Joi.string().trim().required().label('Anime IDs'),
  song_id: songIdSchema.required(),
  type: songTypeSchema,
  artist: Joi.string().trim().empty(null).default(null).label('Artist'),
  song_title: songTitleSchema,
  src: songSrcSchema
})
  .label('Song Raw')
  .meta({ className: 'ISongRaw' });

const songTitleRawSchema = Joi.object({
  song_title: songTitleSchema
})
  .label('Song Title Raw')
  .meta({ className: 'ISongTitleRaw' });

export {
  songSchema,
  songTypeSchema,
  songIdSchema,
  songRawSchema,
  songTitleRawSchema,
  newSongSchema
};
