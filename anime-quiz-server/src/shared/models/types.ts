import { z } from 'zod';
import { ClientData, NotificationColor, SystemNotification } from './client';

export type ClientDataType = z.infer<typeof ClientData>;
export type NotificationColorType = z.infer<typeof NotificationColor>;
export type SystemNotificationType = z.infer<typeof SystemNotification>;
