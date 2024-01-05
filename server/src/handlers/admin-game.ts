import { ServerHandler } from './common';
import { SOCKET_EVENTS } from '../shared/events';
import { SocketIdType, SongType } from '../shared/models/types';
import { Song } from '../shared/models/song';
import { SocketId } from '../shared/models/client';

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
    },
    [SOCKET_EVENTS.ADMIN_GAME_KICK_PLAYER]: (_socketId: SocketIdType) => {
      this._logger.info('game kick player', {
        request: _socketId,
        clientData: this._socket.data.clientData
      });
      this._validateIsAdmin();
      const socketId = SocketId.parse(_socketId);
      this._emitter.systemNotification(
        {
          color: 'error',
          message: 'You have been kicked'
        },
        socketId
      );
      this._io.sockets.sockets.get(socketId)?.disconnect();
    }
  };
}

export { AdminGameHandler };
