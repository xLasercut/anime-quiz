import io from 'socket.io-client'
import store from '@/store'

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

function leaveAllRooms(): void {
  socket.emit('LEAVE_ALL_ROOM')
  store.commit('RESET_STORE_STATE')
}

export {socket, leaveAllRooms}
