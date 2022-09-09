import * as Joi from 'joi';

const animeNameSchema = Joi.string()
  .trim()
  .required()
  .label('Anime Name')
  .meta({ className: 'IAnimeName' });

const animeIdSchema = Joi.string()
  .trim()
  .pattern(/^anime-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
  .required()
  .label('Anime ID')
  .meta({ className: 'IAnimeId' });

const animeSchema = Joi.object({
  anime_id: animeIdSchema,
  anime_name: Joi.array().min(1).items(animeNameSchema).required().label('Anime Names')
})
  .label('Anime')
  .meta({ className: 'IAnime' });

const animeRawSchema = Joi.object({
  anime_id: animeIdSchema,
  anime_name: Joi.string().trim().required().label('Anime Name')
})
  .label('Anime Raw')
  .meta({ className: 'IAnimeRaw' });

export { animeNameSchema, animeIdSchema, animeSchema, animeRawSchema };
