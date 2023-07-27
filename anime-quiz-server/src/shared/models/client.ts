import { z } from 'zod';
import { AVATARS } from '../avatars';
import { UserId } from './user';

const DiscordId = z.string().trim().min(1);

const ClientDisplayName = z
  .string()
  .trim()
  .min(1)
  .regex(/^[A-Za-z0-9 ]+$/);

const ClientData = z.object({
  userId: UserId,
  displayName: ClientDisplayName,
  discordId: DiscordId,
  admin: z.boolean(),
  avatar: z.string().trim().min(1),
  host: z.boolean(),
  auth: z.boolean()
});

const NotificationColor = z.union([
  z.literal('error'),
  z.literal('warning'),
  z.literal('success'),
  z.literal('info')
]);

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
const SystemNotification = z.object({
  color: NotificationColor,
  message: z.string().trim().min(1)
});

export { ClientData, NotificationColor, SystemNotification, Avatar, ClientDisplayName, DiscordId };
