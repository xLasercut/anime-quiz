<template>
  <v-app>
    <nav-bar></nav-bar>
    <v-container :fluid="true">
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
import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import { NotificationColorType, SystemNotificationType } from '@/assets/shared/models/types';
import { OpenDialog, SendNotification } from '@/assets/types';
import GlobalDialog from '@/components/app/GlobalDialog.vue';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { ClientDialogRoute } from '@/assets/routing/types';

const clientStore = useClientStore();

let sendNotification: SendNotification;
let openDialog: OpenDialog;
provide(CLIENT_EVENTS.REGISTER_SEND_NOTIFICATION, (_sendNotification: SendNotification): void => {
  sendNotification = _sendNotification;
});
provide(CLIENT_EVENTS.REGISTER_OPEN_DIALOG, (_openDialog: OpenDialog): void => {
  openDialog = _openDialog;
});

provide(CLIENT_EVENTS.OPEN_DIALOG, (route: ClientDialogRoute, label: string): void => {
  openDialog(route, label);
});
provide(CLIENT_EVENTS.SYSTEM_NOTIFICATION, (color: NotificationColorType, message: string): void => {
  sendNotification(color, message);
});

function viewComponent() {
  return VIEW_MAPPING[clientStore.view];
}

socket.on(SOCKET_EVENTS.SYSTEM_NOTIFICATION, (notification: SystemNotificationType) => {
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
</style>
