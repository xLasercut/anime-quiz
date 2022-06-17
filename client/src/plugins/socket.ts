import { io } from 'socket.io-client';
import { MUTATIONS } from './store/mutations';
import { store } from './store';
import { ROUTES } from './routing/routes';
import { LOCAL_STORAGE_CONSTANTS } from '../assets/constants';

const GAME_SERVER = localStorage[LOCAL_STORAGE_CONSTANTS.GAME_SERVER] || '';
const socket = io(GAME_SERVER, { autoConnect: false });

for (const mutation of Object.values(MUTATIONS)) {
  if (mutation.startsWith('SOCKET_')) {
    socket.on(mutation.replace('SOCKET_', ''), (data: any): void => {
      store.commit(mutation, data);
    });
  }
}

socket.on('disconnect', () => {
  store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.LOGIN);
});

export { socket };
