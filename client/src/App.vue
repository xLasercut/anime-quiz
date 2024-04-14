<template>
  <v-app>
    <nav-bar></nav-bar>
    <v-container :fluid="true" :style="mainContainerStyles()">
      <v-main>
        <component :is="viewComponent()"></component>
      </v-main>
    </v-container>
    <system-notification></system-notification>
    <global-dialog></global-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, provide } from 'vue';
import { VIEW_MAPPING } from '@/assets/routing/mapping';
import { useClientStore } from '@/plugins/store/client';
import NavBar from '@/components/app/NavBar.vue';
import SystemNotification from '@/components/app/SystemNotification.vue';
import { CLIENT_EVENTS } from '@/assets/events';
import { CLIENT_CONSTANTS, LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import { SOCKET_EVENTS, TNotificationColor, TSystemNotification } from 'anime-quiz-shared-resources';
import { TOpenDialog, TSendNotification } from '@/assets/types';
import GlobalDialog from '@/components/app/GlobalDialog.vue';
import { socket } from '@/plugins/socket';
import { ClientDialogRoute } from '@/assets/routing/types';

const clientStore = useClientStore();

let sendNotification: TSendNotification;
let openDialog: TOpenDialog;
provide(CLIENT_EVENTS.REGISTER_SEND_NOTIFICATION, (_sendNotification: TSendNotification): void => {
  sendNotification = _sendNotification;
});
provide(CLIENT_EVENTS.REGISTER_OPEN_DIALOG, (_openDialog: TOpenDialog): void => {
  openDialog = _openDialog;
});

provide(CLIENT_EVENTS.OPEN_DIALOG, (route: ClientDialogRoute, label: string): void => {
  openDialog(route, label);
});
provide(CLIENT_EVENTS.SYSTEM_NOTIFICATION, (color: TNotificationColor, message: string): void => {
  sendNotification(color, message);
});

function viewComponent() {
  return VIEW_MAPPING[clientStore.view];
}

function mainContainerStyles() {
  return {
    ['white-space']: 'pre-wrap',
    overflow: 'auto',
    height: CLIENT_CONSTANTS.MAIN_CONTAINER_HEIGHT
  };
}

socket.on(SOCKET_EVENTS.SYSTEM_NOTIFICATION, (notification: TSystemNotification) => {
  sendNotification(notification.color, notification.message);
});

onMounted(() => {
  if (!localStorage[LOCAL_STORAGE_CONSTANTS.GAME_SERVER]) {
    sendNotification('error', 'Server URL not set');
  }
});
</script>

<style>
thead {
  z-index: 30;
}

.main-game-answer-container {
  font-size: 16pt;
  text-align: center;
  border-radius: 5px;
  padding: 5px;
}
</style>
