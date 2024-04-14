import { Socket } from 'socket.io-client';
import { useClientStore } from '@/plugins/store/client';
import { pinia } from '@/plugins/store';
import { ClientData, SOCKET_EVENTS, TClientData } from 'anime-quiz-shared-resources';

const clientStore = useClientStore(pinia);

function startClientStoreListeners(socket: Socket) {
  socket.on(SOCKET_EVENTS.UPDATE_STORE_CLIENT_DATA, (_clientData: TClientData) => {
    const clientData = ClientData.parse(_clientData);
    clientStore.updateClientData(clientData);
  });
}

export { startClientStoreListeners };
