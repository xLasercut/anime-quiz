import { z } from 'zod';
import { User } from './user';

const NotificationColor = z.union([z.literal('error'), z.literal('warning'), z.literal('success'), z.literal('info')]);

const SystemNotification = z.object({
  color: NotificationColor,
  message: z.string().trim().min(1)
});

const ClientData = z.intersection(
  User,
  z.object({
    host: z.boolean(),
    auth: z.boolean()
  })
);

const ClientLoginAuth = z.object({
  code: z.string(),
  dataVersion: z.string()
});

export { ClientData, NotificationColor, SystemNotification, ClientLoginAuth };
