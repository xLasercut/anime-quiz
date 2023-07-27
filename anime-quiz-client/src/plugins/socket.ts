import { io } from 'socket.io-client';
import { useClientStore } from '@/plugins/store/client';
import { pinia } from '@/plugins/store';
import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { ClientDataType } from '@/assets/shared/models/types';
import {ClientData} from "@/assets/shared/models/client";

const GAME_SERVER = localStorage[LOCAL_STORAGE_CONSTANTS.GAME_SERVER] || '';
const socket = io(GAME_SERVER, { autoConnect: false });

const clientStore = useClientStore(pinia);

socket.on(SOCKET_EVENTS.UPDATE_STORE_CLIENT_DATA, (_clientData: ClientDataType) => {
  const clientData = ClientData.parse(_clientData);
  clientStore.updateClientData(clientData);
});

socket.on(SOCKET_EVENTS.DISCONNECT, () => {
  window.location.href = '/';
});

export { socket };
