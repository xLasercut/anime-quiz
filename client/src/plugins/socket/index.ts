import { io } from 'socket.io-client';
import { LOCAL_STORAGE_CONSTANTS, ROOT_URL_PATH } from '@/assets/constants';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources';
import { startDataStoreListeners } from '@/plugins/socket/data';
import { startClientStoreListeners } from '@/plugins/socket/client';
import { startGameStoreListeners } from '@/plugins/socket/game';

const GAME_SERVER = localStorage[LOCAL_STORAGE_CONSTANTS.GAME_SERVER] || '';
const socket = io(GAME_SERVER, { autoConnect: false });

startClientStoreListeners(socket);
startDataStoreListeners(socket);
startGameStoreListeners(socket);

socket.on(SOCKET_EVENTS.DISCONNECT, () => {
  window.location.href = ROOT_URL_PATH;
});

export { socket };
