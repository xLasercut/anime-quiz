import { AbstractHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { Socket } from '../types';

class SongHandler extends AbstractHandler {
  public start(socket: Socket, errHandler: Function): void {
    socket.on(
      SOCKET_EVENTS.JOIN_SONG_LIST_EDIT,
      errHandler(() => {})
    );
  }
}

export { SongHandler };
