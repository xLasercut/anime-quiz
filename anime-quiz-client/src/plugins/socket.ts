import { io } from 'socket.io-client';
import { useClientStore } from '@/plugins/store/client';
import { pinia } from '@/plugins/store';
import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';

const GAME_SERVER = localStorage[LOCAL_STORAGE_CONSTANTS.GAME_SERVER] || '';
const socket = io(GAME_SERVER, { autoConnect: false });

const clientStore = useClientStore(pinia);
socket.on('disconnect', () => {
  clientStore.$reset();
});

export { socket };
