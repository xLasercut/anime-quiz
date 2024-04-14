import { z } from 'zod';
import { DbUser, DbUserSong } from './user';
import { DbSong, DbSongTitle } from './song';
import { DbAnime } from './anime';
import { DbSongStats } from './song-stats';

type TDbUser = z.infer<typeof DbUser>;
type TDbSong = z.infer<typeof DbSong>;
type TDbAnime = z.infer<typeof DbAnime>;
type TDbSongTitle = z.infer<typeof DbSongTitle>;
type TDbUserSong = z.infer<typeof DbUserSong>;
type TDbSongStats = z.infer<typeof DbSongStats>;

export type { TDbUser, TDbSong, TDbAnime, TDbSongTitle, TDbUserSong, TDbSongStats };
