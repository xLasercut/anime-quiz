<template>
  <v-btn @click="login()">login via discord</v-btn>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { ClientDataType } from '@/assets/shared/models/types';
import { useClientStore } from '@/plugins/store/client';
import { ClientData } from '@/assets/shared/models/client';
import { ROUTES } from '@/plugins/routing/routes';

export default defineComponent({
  setup() {
    const clientStore = useClientStore();

    function login() {
      socket.connect();
      socket.emit(SOCKET_EVENTS.GET_AUTHORIZE_URL, (url: string) => {
        window.location.href = url;
      });
    }

    function authorizeUser() {
      if (window.location.search.includes('code=')) {
        const code = getCodeFromUrl();
        socket.connect();
        socket.emit(SOCKET_EVENTS.AUTHORIZE_USER, code, (_clientData: ClientDataType) => {
          const clientData = ClientData.parse(_clientData);
          clientStore.updateClientData(clientData);
          clientStore.changeView(ROUTES.LOBBY);
        });
      }
    }

    function getCodeFromUrl(): string {
      const regex = new RegExp('code=([^&]*)', 'g');
      const matches = regex.exec(window.location.search);
      if (!matches) {
        return '';
      }
      return matches[1];
    }

    onMounted(() => {
      authorizeUser();
    });
    return { login };
  }
});
</script>
