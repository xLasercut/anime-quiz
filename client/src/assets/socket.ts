import io from 'socket.io-client'
import store from '@/store'
import {IChoices, ISong} from '../../../shared/interfaces/database'
import {IAmqPlayer} from '../../../shared/interfaces/amq'

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

export {socket}
