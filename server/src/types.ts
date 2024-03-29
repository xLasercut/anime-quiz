import { DefaultEventsMap, EventsMap } from 'socket.io/dist/typed-events';
import { Socket as SocketIoSocket } from 'socket.io';
import { SocketData } from './app/socket-data';

export type Socket = SocketIoSocket<DefaultEventsMap, EventsMap, DefaultEventsMap, SocketData>;
export type SocketEvent = (...args: any[]) => void | Promise<void>;
export type ErrorHandler = (func: Function) => (...args: any[]) => void;
