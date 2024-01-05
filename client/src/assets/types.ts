import { NotificationColorType } from '@/assets/shared/models/types';
import { ClientDialogRoute } from '@/assets/routing/types';

export type SendNotification = (color: NotificationColorType, message: string) => void;
export type RegisterSendNotification = (func: SendNotification) => void;
export type OpenDialog = (dialog: ClientDialogRoute, label: string) => void;
export type RegisterOpenDialog = (func: OpenDialog) => void;
