import {io} from 'socket.io-client'

const socket = io('http://192.168.88.128:3000')

export {
  socket
}
