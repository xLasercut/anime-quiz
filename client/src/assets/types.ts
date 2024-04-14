import { TAnimeId, TNotificationColor } from 'anime-quiz-shared-resources';
import { ClientDialogRoute } from '@/assets/routing/types';
import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';

type TSendNotification = (color: TNotificationColor, message: string) => void;
type TRegisterSendNotification = (func: TSendNotification) => void;
type TOpenDialog = (dialog: ClientDialogRoute, label: string) => void;
type TRegisterOpenDialog = (func: TOpenDialog) => void;
type TLocalStorageConstant = (typeof LOCAL_STORAGE_CONSTANTS)[keyof typeof LOCAL_STORAGE_CONSTANTS];
type TGameTooltipPosition = 'top' | 'left' | 'bottom' | 'right';

interface TAnimeString {
  animeId: TAnimeId;
  animeName: string;
}

export type {
  TSendNotification,
  TRegisterSendNotification,
  TOpenDialog,
  TRegisterOpenDialog,
  TLocalStorageConstant,
  TGameTooltipPosition,
  TAnimeString
};
