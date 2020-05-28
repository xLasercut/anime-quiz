import io from 'socket.io-client'
import store from '@/store'
import {IChatBot, IChoices, IEmoji, ISong} from '../../../shared/interfaces/database'
import {IAmqPlayer} from '../../../shared/interfaces/amq'
import {IRoomSerial} from '../../../shared/interfaces/game'

//@ts-ignore
const socket = io(GAME_SERVER, {autoConnect: false})

socket.on('UPDATE_SONG_LIST', (songList: Array<ISong>): void => {
  store.commit('SOCKET_UPDATE_SONG_LIST', songList)
})

socket.on('UPDATE_USERS', (users: Array<string>): void => {
  store.commit('SOCKET_UPDATE_USERS', users)
})

socket.on('UPDATE_CHOICES', (choices: IChoices): void => {
  store.commit('SOCKET_UPDATE_CHOICES', choices)
})

socket.on('UPDATE_ADMIN', (admin: boolean): void => {
  store.commit('SOCKET_UPDATE_ADMIN', admin)
})

socket.on('UPDATE_USER_SONGS', (userSongs: Array<string>): void => {
  store.commit('SOCKET_UPDATE_USER_SONGS', userSongs)
})

socket.on('UPDATE_AMQ_PLAYER_LIST', (playerList: Array<IAmqPlayer>): void => {
  store.commit('SOCKET_UPDATE_AMQ_PLAYER_LIST', playerList)
})

socket.on('UPDATE_ROOM_LIST', (roomList: Array<IRoomSerial>): void => {
  store.commit('SOCKET_UPDATE_ROOM_LIST', roomList)
})

socket.on('UPDATE_EMOJI_LIST', (emojiList: Array<IEmoji>): void => {
  store.commit('SOCKET_UPDATE_EMOJI_LIST', emojiList)
})

socket.on('UPDATE_CHAT_BOT_LIST', (chatBotList: Array<IChatBot>): void => {
  store.commit('SOCKET_UPDATE_CHAT_BOT_LIST', chatBotList)
})

export {socket}
