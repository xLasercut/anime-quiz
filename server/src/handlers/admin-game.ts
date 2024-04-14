import { ServerHandler } from './common';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources/src/events';
import { TSocketId, TSong } from 'anime-quiz-shared-resources/src/models/types';
import { Song } from 'anime-quiz-shared-resources/src/models/song';
import { SocketId } from 'anime-quiz-shared-resources/src/models/client';

class AdminGameHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.ADMIN_GAME_SONG_OVERRIDE]: (_song: TSong) => {
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
    [SOCKET_EVENTS.ADMIN_GAME_KICK_PLAYER]: (_socketId: TSocketId) => {
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
