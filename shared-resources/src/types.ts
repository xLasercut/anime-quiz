import { SOCKET_EVENTS } from './events';

type TSocketEventName = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];

export type { TSocketEventName };
