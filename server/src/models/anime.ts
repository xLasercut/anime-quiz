import { z } from 'zod';
import { AnimeId, AnimeName } from 'anime-quiz-shared-resources';
import { isValidJson } from './common';

const DbAnime = z.object({
  anime_name: z
    .string()
    .trim()
    .min(1)
    .refine((val) => isValidJson(val), { message: 'Invalid json string' })
    .transform((val) => JSON.parse(val))
    .pipe(z.array(AnimeName)),
  anime_id: AnimeId
});

const DbAnimeName = z.object({
  anime_name: AnimeName
});

export { DbAnime, DbAnimeName };
