import {io} from 'socket.io-client'
import {MUTATIONS} from './store/mutations'
import {store} from './store'

const GAME_SERVER = localStorage.GAME_SERVER || ''
const socket = io(GAME_SERVER, { autoConnect: false })

for (const mutation in MUTATIONS) {
  if (mutation.startsWith('SOCKET_')) {
    socket.on(mutation.replace('SOCKET_', ''), (data: any): void => {
      store.commit(mutation, data)
    })
  }
}

export {
  socket
}
