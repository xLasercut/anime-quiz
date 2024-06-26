import { z } from 'zod';

import { Avatar, DiscordId, DisplayName, UserId } from 'anime-quiz-shared-resources';
import { isValidJson } from './common';
import { SongId } from 'anime-quiz-shared-resources';

const DbUserAdmin = z.number().transform((arg) => {
  return arg === 1;
});

const DbUser = z.object({
  user_id: UserId,
  display_name: DisplayName,
  discord_id: DiscordId,
  admin: DbUserAdmin,
  avatar: Avatar
});

const DbUserSongList = z.object({
  user_id: UserId,
  discord_id: DiscordId,
  display_name: DisplayName,
  admin: DbUserAdmin,
  avatar: Avatar,
  song_id: z
    .string()
    .trim()
    .min(1)
    .refine((val) => isValidJson(val), { message: 'Invalid json string' })
    .transform((val) => JSON.parse(val))
    .transform((vals: (string | null)[]) => {
      return vals.filter((val) => {
        return val;
      });
    })
    .pipe(z.array(SongId))
    .transform((val) => Array.from(new Set(val)))
});

const DbUserSong = z.object({
  user_id: UserId,
  song_id: z.array(SongId)
});

export { DbUser, DbUserSongList, DbUserSong };
