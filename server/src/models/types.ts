import { z } from 'zod';
import { DbUser, DbUserSong } from './user';
import { DbSong, DbSongTitle } from './song';
import { DbAnime } from './anime';
import { DbSongStats } from './song-stats';

export type DbUserType = z.infer<typeof DbUser>;
export type DbSongType = z.infer<typeof DbSong>;
export type DbAnimeType = z.infer<typeof DbAnime>;
export type DbSongTitleType = z.infer<typeof DbSongTitle>;
export type DbUserSongType = z.infer<typeof DbUserSong>;
export type DbSongStatsType = z.infer<typeof DbSongStats>;
