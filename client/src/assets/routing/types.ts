import { DIALOG_ROUTES } from '@/assets/routing/routes';

type ClientDialogRoute = (typeof DIALOG_ROUTES)[keyof typeof DIALOG_ROUTES];

export type { ClientDialogRoute };
