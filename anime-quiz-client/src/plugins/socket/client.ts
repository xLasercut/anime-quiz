import { Socket } from 'socket.io-client';
import { useClientStore } from '@/plugins/store/client';
import { pinia } from '@/plugins/store';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { ClientDataType } from '@/assets/shared/models/types';
import { ClientData } from '@/assets/shared/models/client';

const clientStore = useClientStore(pinia);

function startClientStoreListeners(socket: Socket) {
  socket.on(SOCKET_EVENTS.UPDATE_STORE_CLIENT_DATA, (_clientData: ClientDataType) => {
    const clientData = ClientData.parse(_clientData);
    clientStore.updateClientData(clientData);
  });
}

export { startClientStoreListeners };
