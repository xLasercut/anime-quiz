import { Socket } from '../types';
import { HandlerDependencies } from '../interfaces';
import { UserHandler } from './user';
import { SongHandler } from './song';

function startHandler(
  socket: Socket,
  errHandler: Function,
  dependencies: HandlerDependencies
): void {
  const userHandler = new UserHandler(dependencies);
  const songHandler = new SongHandler(dependencies);
  userHandler.start(socket, errHandler);
  songHandler.start(socket, errHandler);
}

export { startHandler };
