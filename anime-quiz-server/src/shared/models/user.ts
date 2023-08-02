import { z } from 'zod';
import { AVATARS } from '../avatars';

const Admin = z.boolean();

const DiscordId = z.string().trim().min(1).regex(/^\d+$/);

const DisplayName = z
  .string()
  .trim()
  .min(1)
  .regex(/^[A-Za-z0-9 ]+$/);

const UserId = z
  .string()
  .trim()
  .min(1)
  .regex(/^user-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);

const Avatar = z
  .string()
  .trim()
  .refine(
    (val) => {
      return Object.values(AVATARS).includes(val);
    },
    {
      message: 'Invalid avatar'
    }
  );

const User = z.object({
  userId: UserId,
  displayName: DisplayName,
  discordId: DiscordId,
  admin: Admin,
  avatar: Avatar
});

export { UserId, User, Avatar, DisplayName, DiscordId, Admin };
