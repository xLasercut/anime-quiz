import io from 'socket.io-client'

//@ts-ignore
const socket = io(GAME_SERVER, {autoConnect: false})

export {socket}
