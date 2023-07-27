import { z } from 'zod';
import { ClientDisplayName, DiscordId } from '../shared/models/client';

const DbUser = z.object({
  user_id: z.string().trim().min(1),
  display_name: ClientDisplayName,
  discord_id: DiscordId,
  admin: z.number().transform((arg) => {
    return arg === 1;
  }),
  avatar: z.string().trim().min(1)
});

const DbAllowedUser = z.object({
  discord_id: z.string().trim().min(1)
});

export { DbUser, DbAllowedUser };
