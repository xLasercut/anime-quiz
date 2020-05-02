import {io} from './app/init'

io.on('connect', (socket) => {
  console.log('test')
})
