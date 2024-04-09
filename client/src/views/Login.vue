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
            <icon-btn icon="mdi-login" color="success" @click="login()" :disabled="disabled"> login via discord </icon-btn>
          </v-col>
        </v-row>
        <v-row :dense="true">
          <v-col cols="auto"> Client Version: {{ CLIENT_VERSION }}</v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { useClientStore } from '@/plugins/store/client';
import { ROUTES } from '@/assets/routing/routes';
import IconBtn from '@/components/common/buttons/IconBtn.vue';
import { CLIENT_VERSION, LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import { CLIENT_EVENTS } from '@/assets/events';
import { SendNotification } from '@/assets/types';
import { getAuthorizeUrl } from '@/assets/authorization';
import { ClientLoginAuthType } from '@/assets/shared/models/types';
import { useDataStore } from '@/plugins/store/data';

const clientStore = useClientStore();
const dataStore = useDataStore();
const sendNotification = inject(CLIENT_EVENTS.SYSTEM_NOTIFICATION) as SendNotification;
const disabled = ref(false);

function login() {
  if (!localStorage[LOCAL_STORAGE_CONSTANTS.GAME_SERVER]) {
    sendNotification('error', 'Server URL not set');
    return;
  }
  disabled.value = true;
  window.location.href = getAuthorizeUrl();
}

function authorizeUser() {
  const parseSearchParams = new URLSearchParams(window.location.search);
  const returnedState = parseSearchParams.get('state');
  const code = parseSearchParams.get('code');

  if (code && returnedState !== localStorage[LOCAL_STORAGE_CONSTANTS.OAUTH_STATE]) {
    console.error('State mismatch');
    window.location.href = '/anime-quiz/';
    return;
  }

  if (code && returnedState === localStorage[LOCAL_STORAGE_CONSTANTS.OAUTH_STATE]) {
    disabled.value = true;
    const clientLoginAuth: ClientLoginAuthType = {
      code: code,
      dataVersion: dataStore.dataVersion,
      clientVersion: CLIENT_VERSION
    };
    socket.connect();
    socket.emit(SOCKET_EVENTS.AUTHORIZE_USER, clientLoginAuth, (auth: boolean) => {
      disabled.value = false;
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
</script>
