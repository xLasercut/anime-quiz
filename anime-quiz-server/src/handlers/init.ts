import { Socket } from '../types';
import { HandlerDependencies } from '../interfaces';
import { UserHandler } from './user';

function startHandler(
  socket: Socket,
  errHandler: Function,
  dependencies: HandlerDependencies
): void {
  const userHandler = new UserHandler(socket, errHandler, dependencies);
  userHandler.start();
}

export { startHandler };
