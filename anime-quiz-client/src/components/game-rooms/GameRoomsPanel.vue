<template>
  <nav-btn icon="mdi-plus" color="success" @click="newRoom()">New Room</nav-btn>
  <nav-btn icon="mdi-refresh" color="info" @click="reload()">Reload</nav-btn>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { useClientStore } from '@/plugins/store/client';
import { DIALOG_ROUTES, ROUTES } from '@/assets/routing/routes';
import { useDataStore } from '@/plugins/store/data';
import { injectStrict } from '@/assets/game-helpers';
import { CLIENT_EVENTS } from '@/assets/events';
import { OpenDialog } from '@/assets/types';
import { useAdminStore } from '@/plugins/store/admin';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';

const clientStore = useClientStore();
const dataStore = useDataStore();
const adminStore = useAdminStore();
const openDialog = injectStrict<OpenDialog>(CLIENT_EVENTS.OPEN_DIALOG);

function back() {
  clientStore.changeView(ROUTES.LOBBY);
}

function reload() {
  socket.emit(SOCKET_EVENTS.GET_ROOM_LIST);
}

function newRoom() {
  openDialog(DIALOG_ROUTES.NEW_GAME_ROOM, 'New Room');
}
</script>
