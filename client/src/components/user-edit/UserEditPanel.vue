<template>
  <nav-btn icon="mdi-plus" color="success" @click="newUser()">New User</nav-btn>
  <nav-btn icon="mdi-refresh" color="info" @click="reload()">Reload</nav-btn>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { useClientStore } from '@/plugins/store/client';
import { DIALOG_ROUTES, ROUTES } from '@/assets/routing/routes';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources';
import { useDataStore } from '@/plugins/store/data';
import { CLIENT_EVENTS } from '@/assets/events';
import { TOpenDialog } from '@/assets/types';
import { useAdminStore } from '@/plugins/store/admin';
import { DATABASE_EDIT_MODE } from '@/assets/constants';
import { inject } from 'vue';

const clientStore = useClientStore();
const dataStore = useDataStore();
const adminStore = useAdminStore();
const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as TOpenDialog;

function back() {
  clientStore.changeView(ROUTES.LOBBY);
}

function reload() {
  dataStore.updateUserList([]);
  socket.emit(SOCKET_EVENTS.UPDATE_STORE_USER_LIST);
}

function newUser() {
  adminStore.updateUserInEdit({
    discordId: '',
    userId: '',
    displayName: '',
    avatar: 'Zero Two',
    admin: false
  });
  adminStore.generateNewUserId();
  adminStore.updateEditMode(DATABASE_EDIT_MODE.NEW);
  openDialog(DIALOG_ROUTES.USER_EDIT, 'New User');
}
</script>
