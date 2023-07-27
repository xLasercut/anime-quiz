import { z } from 'zod';
import { AnimeId, AnimeName } from '../shared/models/anime';
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

export { DbAnime };
