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
import { SOCKET_EVENTS, TClientLoginAuth } from 'anime-quiz-shared-resources';
import IconBtn from '@/components/common/buttons/IconBtn.vue';
import { CLIENT_VERSION, LOCAL_STORAGE_CONSTANTS, ROOT_URL_PATH } from '@/assets/constants';
import { CLIENT_EVENTS } from '@/assets/events';
import { TSendNotification } from '@/assets/types';
import { getAuthorizeUrl } from '@/assets/authorization';
import { useDataStore } from '@/plugins/store/data';
import { useRouter } from 'vue-router';
import { useClientStore } from '@/plugins/store/client';

const dataStore = useDataStore();
const clientStore = useClientStore();
const sendNotification = inject(CLIENT_EVENTS.SYSTEM_NOTIFICATION) as TSendNotification;
const disabled = ref(false);
const router = useRouter();

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

  if (!code) {
    clientStore.$reset();
    dataStore.$reset();
    socket.disconnect();
  }

  if (code && returnedState !== localStorage[LOCAL_STORAGE_CONSTANTS.OAUTH_STATE]) {
    console.error('State mismatch');
    window.location.href = ROOT_URL_PATH;
    return;
  }

  if (code && returnedState === localStorage[LOCAL_STORAGE_CONSTANTS.OAUTH_STATE]) {
    disabled.value = true;
    const clientLoginAuth: TClientLoginAuth = {
      code: code,
      dataVersion: dataStore.dataVersion,
      clientVersion: CLIENT_VERSION
    };
    socket.connect();
    socket.emit(SOCKET_EVENTS.AUTHORIZE_USER, clientLoginAuth, (auth: boolean) => {
      disabled.value = false;
      if (auth) {
        router.push('/lobby');
      } else {
        socket.disconnect();
        router.push('/login');
      }
    });
  }
}

onMounted(() => {
  authorizeUser();
});
</script>
