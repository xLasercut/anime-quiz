import { AbstractHandler } from './abstract';
import { Logger } from '../app/logging/logger';
import { ISocket } from '../types';
import { SHARED_EVENTS } from '../shared/events';
import { RoomEmitter } from '../emitters/room';

class RoomHandler extends AbstractHandler {
  protected _roomEmitter: RoomEmitter;

  constructor(logger: Logger, roomEmitter: RoomEmitter) {
    super(logger);
    this._roomEmitter = roomEmitter;
  }

  public start(socket: ISocket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.LEAVE_ALL_ROOMS, () => {
      try {
        for (const roomId of Array.from(socket.rooms)) {
          if (roomId !== socket.id) {
            socket.leave(roomId);
          }
        }
      } catch (e) {
        errorHandler(e);
      }
    });

    socket.on(SHARED_EVENTS.GET_ROOM_LIST, () => {
      try {
        this._roomEmitter.updateRoomList(socket.id);
      } catch (e) {
        errorHandler(e);
      }
    });
  }
}

export { RoomHandler };
