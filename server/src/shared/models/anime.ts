import { z } from 'zod';

const AnimeId = z
  .string()
  .trim()
  .min(1)
  .regex(/^anime-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);

const AnimeName = z.string().trim().min(1);

const Anime = z.object({
  animeName: z.array(AnimeName),
  animeId: AnimeId
});

export { AnimeId, AnimeName, Anime };
