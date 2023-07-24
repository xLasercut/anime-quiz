import { io } from 'socket.io-client';

const GAME_SERVER = 'http://localhost:3000';
const socket = io(GAME_SERVER, { autoConnect: false });

socket.on('disconnect', () => {});

export { socket };
