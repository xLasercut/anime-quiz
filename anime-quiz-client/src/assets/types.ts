import { NotificationColorType } from '@/assets/shared/models/types';

export type SendNotification = (color: NotificationColorType, message: string) => void;
export type RegisterSendNotification = (func: SendNotification) => void;
export type OpenDialog = (dialog: string, label: string) => void;
export type RegisterOpenDialog = (func: OpenDialog) => void;
