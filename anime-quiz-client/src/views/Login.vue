<template>
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
            <icon-btn icon="mdi-login" color="success" @click="login()" :disabled="disabled">
              login via discord
            </icon-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
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
import { getAuthorizeUrl } from '@/assets/authorization';

export default defineComponent({
  components: { IconBtn },
  setup() {
    const clientStore = useClientStore();
    const sendNotification = injectStrict<SendNotification>(CLIENT_EVENTS.SYSTEM_NOTIFICATION);
    const state = reactive({
      disabled: false
    });

    function login() {
      if (!localStorage[LOCAL_STORAGE_CONSTANTS.GAME_SERVER]) {
        sendNotification('error', 'Server URL not set');
        return;
      }
      state.disabled = true;
      window.location.href = getAuthorizeUrl();
    }

    function authorizeUser() {
      const parseSearchParams = new URLSearchParams(window.location.search);
      const returnedState = parseSearchParams.get('state');
      const code = parseSearchParams.get('code');

      if (code && returnedState !== localStorage[LOCAL_STORAGE_CONSTANTS.OAUTH_STATE]) {
        console.error('State mismatch');
        window.location.href = '/';
        return;
      }

      if (code && returnedState === localStorage[LOCAL_STORAGE_CONSTANTS.OAUTH_STATE]) {
        state.disabled = true;
        socket.connect();
        socket.emit(SOCKET_EVENTS.AUTHORIZE_USER, code, (auth: boolean) => {
          state.disabled = false;
          if (auth) {
            clientStore.changeView(ROUTES.LOBBY);
          } else {
            socket.disconnect();
          }
        });
      }
    }

    onMounted(() => {
      authorizeUser();
    });

    return { login, ...toRefs(state) };
  }
});
</script>
