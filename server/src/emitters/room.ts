import { AbstractEmitter } from './abstract';
import { SHARED_EVENTS } from '../shared/events';

class RoomEmitter extends AbstractEmitter {
  public updateRoomList(sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_ROOM_LIST, this._io.getGameRoomList());
  }
}

export { RoomEmitter };
