import { createServer } from 'http';
import { Server } from 'socket.io';
import {DISCORD_URL} from "./app/oidc";
import {LOG_BASE} from "anime-quiz-server/src/app/logging/log-base";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});


io.on('connection', (socket) => {
  console.log(`connected: ${socket.id}`)
  socket.emit("discord_redirect", DISCORD_URL)

  socket.on("discord_code", (code) => {
    console.log("discord code")
    console.log(code)
  })

  socket.on('disconnect', async () => {
    console.log(`disconnected ${socket.id}`)
  });
});

httpServer.listen(3000, async () => {
  console.log('started server');
});
