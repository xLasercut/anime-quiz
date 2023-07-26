<template>
  <v-main>
    <v-card variant="flat">
      <v-card-title>
        <v-row justify="center">
          <v-col cols="auto">
            <h2>Login</h2>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-container :fluid="true">
          <v-row justify="center" no-gutters>
            <v-col cols="auto">
              <icon-btn icon="mdi-login" color="success" @click="login()">
                login via discord
              </icon-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { ClientDataType } from '@/assets/shared/models/types';
import { useClientStore } from '@/plugins/store/client';
import { ClientData } from '@/assets/shared/models/client';
import { ROUTES } from '@/assets/routing/routes';
import IconBtn from '@/components/common/buttons/IconBtn.vue';
import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import { injectStrict } from '@/assets/game-helpers';
import { CLIENT_EVENTS } from '@/assets/events';
import { SendNotification } from '@/assets/types';

export default defineComponent({
  components: { IconBtn },
  setup() {
    const clientStore = useClientStore();
    const sendNotification = injectStrict<SendNotification>(CLIENT_EVENTS.SYSTEM_NOTIFICATION);

    function login() {
      if (!localStorage[LOCAL_STORAGE_CONSTANTS.GAME_SERVER]) {
        sendNotification('error', 'Server URL not set');
        return
      }
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
