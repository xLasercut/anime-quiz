import { z } from 'zod';
import { ClientDisplayName, DiscordId } from '../shared/models/client';
import { UserId } from '../shared/models/user';
import { isValidJson } from './common';
import { SongId } from '../shared/models/song';

const DbUserAdmin = z.number().transform((arg) => {
  return arg === 1;
});

const DbUserAvatar = z.string().trim().min(1);

const DbUser = z.object({
  user_id: UserId,
  display_name: ClientDisplayName,
  discord_id: DiscordId,
  admin: DbUserAdmin,
  avatar: DbUserAvatar
});

const DbAllowedUser = z.object({
  discord_id: z.string().trim().min(1)
});

const DbUserSongList = z.object({
  user_id: UserId,
  discord_id: DiscordId,
  display_name: ClientDisplayName,
  admin: DbUserAdmin,
  avatar: DbUserAvatar,
  song_id: z
    .string()
    .trim()
    .min(1)
    .refine((val) => isValidJson(val), { message: 'Invalid json string' })
    .transform((val) => JSON.parse(val))
    .pipe(z.array(SongId))
    .transform((val) => Array.from(new Set(val)))
});

export { DbUser, DbAllowedUser, DbUserSongList };
