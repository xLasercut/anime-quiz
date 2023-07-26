import { z } from 'zod';

const ClientData = z.object({
  userId: z.string().trim().min(1),
  displayName: z.string().trim().min(1),
  discordId: z.string().trim().min(1),
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

const SystemNotification = z.object({
  color: NotificationColor,
  message: z.string().trim().min(1)
});

export { ClientData, NotificationColor, SystemNotification };
