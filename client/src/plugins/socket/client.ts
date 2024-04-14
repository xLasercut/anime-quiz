import { Socket } from 'socket.io-client';
import { useClientStore } from '@/plugins/store/client';
import { pinia } from '@/plugins/store';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources/src/events';
import { TClientData } from 'anime-quiz-shared-resources/src/models/types';
import { ClientData } from 'anime-quiz-shared-resources/src/models/client';

const clientStore = useClientStore(pinia);

function startClientStoreListeners(socket: Socket) {
  socket.on(SOCKET_EVENTS.UPDATE_STORE_CLIENT_DATA, (_clientData: TClientData) => {
    const clientData = ClientData.parse(_clientData);
    clientStore.updateClientData(clientData);
  });
}

export { startClientStoreListeners };
