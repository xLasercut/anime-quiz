import { z } from 'zod';

const DbUser = z.object({
  user_id: z.string().trim().min(1),
  display_name: z.string().trim().min(1),
  discord_id: z.string().trim().min(1),
  admin: z.number().transform((arg) => {
    return arg === 1;
  }),
  avatar: z.string().trim().min(1)
});

export { DbUser };
