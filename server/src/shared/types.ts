import { SOCKET_EVENTS } from './events';

export type SocketEventNameType = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
