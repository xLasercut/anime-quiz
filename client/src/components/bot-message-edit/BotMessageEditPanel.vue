<template>
  <nav-btn icon="mdi-plus" color="success" @click="newMessage()">New Message</nav-btn>
  <nav-btn icon="mdi-refresh" color="info" @click="reload()">Reload</nav-btn>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { useClientStore } from '@/plugins/store/client';
import { useDataStore } from '@/plugins/store/data';
import { useAdminStore } from '@/plugins/store/admin';
import { inject } from 'vue';
import { CLIENT_EVENTS } from '@/assets/events';
import { OpenDialog } from '@/assets/types';
import { DIALOG_ROUTES, ROUTES } from '@/assets/routing/routes';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { DATABASE_EDIT_MODE } from '@/assets/constants';
import { AVATARS } from '@/assets/shared/avatars';

const clientStore = useClientStore();
const dataStore = useDataStore();
const adminStore = useAdminStore();
const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as OpenDialog;

function reload() {
  dataStore.updateBotMessageList([]);
  socket.emit(SOCKET_EVENTS.UPDATE_STORE_BOT_MESSAGE_LIST);
}

function back() {
  clientStore.changeView(ROUTES.LOBBY);
}

function newMessage() {
  adminStore.updateBotMessageInEdit({
    messageId: '',
    command: '',
    text: '',
    avatar: AVATARS.MADOKA,
    displayName: '',
    userId: ''
  });
  adminStore.generateNewBotMessageId();
  adminStore.updateEditMode(DATABASE_EDIT_MODE.NEW);
  openDialog(DIALOG_ROUTES.BOT_MESSAGE_EDIT, 'New Bot Message');
}
</script>
