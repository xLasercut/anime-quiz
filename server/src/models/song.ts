import { z } from 'zod';
import { SongArtist, SongId, SongSrc, SongTitle, SongType } from '../shared/models/song';
import { isValidJson } from './common';
import { AnimeId, AnimeName } from '../shared/models/anime';
import { AnimeIdType, AnimeNameType } from '../shared/models/types';

const DbSong = z.object({
  song_id: SongId,
  src: SongSrc,
  type: SongType,
  song_title: SongTitle,
  artist: SongArtist,
  anime_name: z
    .string()
    .trim()
    .min(1)
    .refine((val) => isValidJson(val), { message: 'Invalid json string' })
    .transform((val) => JSON.parse(val))
    .pipe(z.array(AnimeName))
    .transform((val) => Array.from(new Set(val))),
  anime_id: z
    .string()
    .trim()
    .min(1)
    .refine((val) => isValidJson(val), { message: 'Invalid json string' })
    .transform((val) => JSON.parse(val))
    .pipe(z.array(AnimeId))
    .transform((val) => Array.from(new Set(val)))
});

const DbSongTitle = z.object({
  song_title: SongTitle
});

export { DbSong, DbSongTitle };
