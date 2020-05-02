import * as socketio from 'socket.io'
import * as express from 'express'

let app = express()
let server = app.listen(3001, () => {

})

let io = socketio(server)


export {io}
