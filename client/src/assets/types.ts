import { AnimeIdType, NotificationColorType } from '@/assets/shared/models/types';
import { ClientDialogRoute } from '@/assets/routing/types';
import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';

export type SendNotification = (color: NotificationColorType, message: string) => void;
export type RegisterSendNotification = (func: SendNotification) => void;
export type OpenDialog = (dialog: ClientDialogRoute, label: string) => void;
export type RegisterOpenDialog = (func: OpenDialog) => void;
export type LocalStorageConstant = (typeof LOCAL_STORAGE_CONSTANTS)[keyof typeof LOCAL_STORAGE_CONSTANTS];
export type GameTooltipPosition = 'top' | 'left' | 'bottom' | 'right';
export interface AnimeString {
  animeId: AnimeIdType;
  animeName: string;
}
