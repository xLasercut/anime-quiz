import { ServerHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { SongType } from '../shared/models/types';
import { Song } from '../shared/models/song';

class AdminGameHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.ADMIN_GAME_SONG_OVERRIDE]: (_song: SongType) => {
      this._logger.info('game song override', {
        request: _song,
        clientData: this._socket.data.clientData
      });
      this._validateIsAdmin();
      const song = Song.parse(_song);
      const roomId = this._socket.data.currentGameRoom;
      this._gameRooms.getRoom(roomId).state.songOverride = song;
      this._emitter.systemNotification(
        {
          color: 'success',
          message: `Song selected - ${song.songTitle}`
        },
        this._socket.id
      );
    }
  };
}

export { AdminGameHandler };
