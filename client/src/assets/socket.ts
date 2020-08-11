import io from 'socket.io-client'
import store from '@/store'
import {IChatBot, IAmqChoices, IEmoji, IAmqSong} from '../../../shared/interfaces/database'
import {IAmqGameState, IAmqPlayer, IAmqSettings} from '../../../shared/interfaces/amq'
import {IRoomSerial} from '../../../shared/interfaces/game'

const GAME_SERVER = localStorage.GAME_SERVER || 'http://localhost:3001'
const socket = io(GAME_SERVER, {autoConnect: false})

socket.on('disconnect', (): void => {
  store.commit('UPDATE_VIEW', 'login')
})

//@ts-ignore
for (let mutation in store._mutations) {
  if (mutation.startsWith('SOCKET_')) {
    socket.on(mutation.replace('SOCKET_', ''), (data: any): void => {
      store.commit(mutation, data)
    })
  }
}


/*socket.on('UPDATE_AMQ_SONG_LIST', (songList: Array<IAmqSong>): void => {
  store.commit('SOCKET_UPDATE_AMQ_SONG_LIST', songList)
})

socket.on('UPDATE_AMQ_USERS', (users: Array<string>): void => {
  store.commit('SOCKET_UPDATE_AMQ_USERS', users)
})

socket.on('UPDATE_AMQ_CHOICES', (choices: IAmqChoices): void => {
  store.commit('SOCKET_UPDATE_AMQ_CHOICES', choices)
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

socket.on('UPDATE_AMQ_SETTINGS', (amqSettings: IAmqSettings): void => {
  store.commit('SOCKET_UPDATE_AMQ_SETTINGS', amqSettings)
})

socket.on('UPDATE_AMQ_GAME_STATE', (amqGameState: IAmqGameState): void => {
  store.commit('SOCKET_UPDATE_AMQ_GAME_STATE', amqGameState)
})

socket.on('UPDATE_AMQ_HOST', (host: boolean): void => {
  store.commit('SOCKET_UPDATE_AMQ_HOST', host)
})*/

export {socket}
