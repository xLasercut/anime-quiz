import { ServerHandler } from './common';
import { GameRoomId, GameRoomSettings, SOCKET_EVENTS, TGameRoomId, TGameRoomSettings } from 'anime-quiz-shared-resources';

class GameRoomsHandler extends ServerHandler {
  protected _events = {
    [SOCKET_EVENTS.LEAVE_ALL_ROOMS]: () => {
      for (const roomId of Array.from(this._socket.rooms)) {
        if (roomId !== this._socket.id) {
          this._socket.leave(roomId);
        }
      }
    },
    [SOCKET_EVENTS.GET_ROOM_LIST]: () => {
      this._emitter.updateRoomList(this._socket.id);
    },
    [SOCKET_EVENTS.JOIN_GAME_ROOM]: (_roomId: TGameRoomId, callback: Function) => {
      this._logger.info('join game room request', {
        clientData: this._socket.data.clientData,
        request: _roomId
      });
      const roomId = GameRoomId.parse(_roomId);
      if (this._gameRooms.roomExists(roomId)) {
        this._socket.join(roomId);
        callback(true);
      } else {
        this._socket.data.setHost(true);
        this._emitter.updateStoreClientData(this._socket.data.clientData, this._socket.id);
        this._socket.join(roomId);
        callback(true);
      }
    },
    [SOCKET_EVENTS.GET_GAME_ROOM_SETTINGS]: () => {
      this._logger.info('getting room settings', {
        clientData: this._socket.data.clientData
      });
      const socketId = this._socket.id;
      const roomId = this._socket.data.currentGameRoom;
      this._emitter.updateGameRoomSettings(this._gameRooms.getRoom(roomId).settings.dict, socketId);
    },
    [SOCKET_EVENTS.UPDATE_SERVER_GAME_ROOM_SETTINGS]: (_settings: TGameRoomSettings) => {
      this._logger.info('updating game room settings', {
        clientData: this._socket.data.clientData,
        request: _settings
      });
      const settings = GameRoomSettings.parse(_settings);
      const roomId = this._socket.data.currentGameRoom;
      this._gameRooms.getRoom(roomId).settings.update(settings);
      this._emitter.updateGameRoomSettings(this._gameRooms.getRoom(roomId).settings.dict, roomId);
      const chatMessage = this._chatSerialiser.generateSystemMsg('Settings updated');
      this._emitter.updateGameChat(chatMessage, roomId);
    }
  };
}

export { GameRoomsHandler };
