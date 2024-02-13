import { z } from 'zod';
import { AnimeId, AnimeName } from './anime';
import { SONG_TYPES } from '../song-types';

const SongId = z
  .string()
  .trim()
  .min(1)
  .regex(/^song-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);

const SongType = z
  .string()
  .trim()
  .refine(
    (val) => {
      return Object.values(SONG_TYPES).includes(val);
    },
    {
      message: 'Invalid song type'
    }
  );

const SongArtist = z.union([
  z.undefined().transform(() => null),
  z.null(),
  z
    .string()
    .trim()
    .transform((val: string) => {
      if (!val) {
        return null;
      }
      return val;
    })
]);

const SongAudioSrc = z.union([
  z.undefined().transform(() => null),
  z.null(),
  z
    .string()
    .trim()
    .transform((val: string) => {
      if (!val) {
        return null;
      }
      return val;
    })
]);

const SongTitle = z.string().trim().min(1);
const SongSrc = z.string().trim().min(1).url();

const Song = z.object({
  songId: SongId,
  src: SongSrc,
  type: SongType,
  songTitle: SongTitle,
  artist: SongArtist,
  animeName: z.array(AnimeName),
  animeId: z.array(AnimeId),
  audioSrc: SongAudioSrc
});

export { SongId, SongType, SongArtist, SongTitle, SongSrc, Song, SongAudioSrc };
