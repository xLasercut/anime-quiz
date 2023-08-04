import { z } from 'zod';
import { DbUser } from './user';
import { DbSong, DbSongTitle } from './song';
import { DbAnime } from './anime';

export type DbUserType = z.infer<typeof DbUser>;
export type DbSongType = z.infer<typeof DbSong>;
export type DbAnimeType = z.infer<typeof DbAnime>;
export type DbSongTitleType = z.infer<typeof DbSongTitle>;
