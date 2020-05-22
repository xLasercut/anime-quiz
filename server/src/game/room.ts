// import {IRoomType} from '../../../shared/types/game'
// import {v4 as uuid4} from 'uuid'
// import {GameDataError} from '../exceptions'
// import {Server} from 'socket.io'
// import {IRoom, ISocket} from '../interfaces'
// import {IRoomSerial} from '../../../shared/interfaces/game'
// import {IBasePlayer} from '../../../shared/interfaces/amq'
//
// class GameRooms {
//   protected _io: Server
//   protected _rooms: { [key: string]: IRoom }
//
//   constructor() {
//     this._rooms = {}
//   }
//
//   public joinRoom(socket: ISocket, roomId: string): void {
//     this._validateRoomIdExists(roomId)
//     socket.roomId = roomId
//     this._rooms[roomId].players.add(socket.id)
//   }
//
//   public newRoom(socket: ISocket, roomName: string, roomType: IRoomType): void {
//     let roomId = uuid4()
//     this._validateRoomIdNotExists(roomId)
//     this._rooms[roomId] = {
//       name: roomName,
//       type: roomType,
//       roomId: roomId,
//       players: new Set([socket.id])
//     }
//     socket.roomId = roomId
//     socket.join(roomId)
//   }
//
//   public leaveRoom(socket: ISocket): void {
//     let roomId = socket.roomId
//     this._validateRoomIdExists(roomId)
//     this._rooms[roomId].players.delete(socket.id)
//     if (this._rooms[roomId].players.size > 0) {
//       this._changeHost(this._rooms[roomId].players.values().next().value)
//     }
//     else {
//       this._deleteRoom(roomId)
//     }
//   }
//
//   public getRoomList(): Array<IRoomSerial> {
//     return Object.values(this._rooms).map((room: IRoom): IRoomSerial => {
//       return {
//         name: room.name,
//         type: room.type,
//         roomId: room.roomId
//       }
//     })
//   }
//
//   public getPlayerList(roomId: string): Array<IBasePlayer> {
//     this._validateRoomIdExists(roomId)
//     let players = this._rooms[roomId].players
//     return Object.values(this._io.sockets.connected).map((socket: ISocket): IBasePlayer => {
//       if (players.has(socket.id)) {
//         return socket.player.serialize()
//       }
//     })
//   }
//
//   protected _deleteRoom(roomId: string): void {
//     delete this._rooms[roomId]
//   }
//
//   protected _changeHost(playerId: string): void {
//     this._io.sockets.connected[playerId]['player'].host = true
//   }
//
//   protected _validateRoomIdNotExists(roomId: string): void {
//     if (roomId in this._rooms) {
//       throw new GameDataError('Room ID already in use')
//     }
//   }
//
//   protected _validateRoomIdExists(roomId: string): void {
//     if (!(roomId in this._rooms)) {
//       throw new GameDataError('Room ID does not exist')
//     }
//   }
// }
//
// export {GameRooms}
