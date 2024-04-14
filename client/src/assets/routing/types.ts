import { DIALOG_ROUTES, ROUTES } from '@/assets/routing/routes';

type ClientRoute = (typeof ROUTES)[keyof typeof ROUTES];
type ClientDialogRoute = (typeof DIALOG_ROUTES)[keyof typeof DIALOG_ROUTES];

export type { ClientRoute, ClientDialogRoute };
