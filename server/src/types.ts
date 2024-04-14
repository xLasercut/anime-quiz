import { DefaultEventsMap, EventsMap } from 'socket.io/dist/typed-events';
import { Socket as SocketIoSocket } from 'socket.io';
import { SocketData } from './app/socket-data';

type Socket = SocketIoSocket<DefaultEventsMap, EventsMap, DefaultEventsMap, SocketData>;
type SocketEvent = (...args: any[]) => void | Promise<void>;
type ErrorHandler = (func: Function) => (...args: any[]) => void;

export type { Socket, SocketEvent, ErrorHandler };
