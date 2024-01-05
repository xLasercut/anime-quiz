import { DIALOG_ROUTES, ROUTES } from '@/assets/routing/routes';

export type ClientRoute = (typeof ROUTES)[keyof typeof ROUTES];
export type ClientDialogRoute = (typeof DIALOG_ROUTES)[keyof typeof DIALOG_ROUTES];
