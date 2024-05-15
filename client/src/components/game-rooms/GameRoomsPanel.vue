<template>
  <nav-btn icon="mdi-plus" color="success" @click="newRoom()">New Room</nav-btn>
  <nav-btn icon="mdi-refresh" color="info" @click="reload()">Reload</nav-btn>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { DIALOG_ROUTES } from '@/assets/routing/routes';
import { CLIENT_EVENTS } from '@/assets/events';
import { TOpenDialog } from '@/assets/types';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources';
import { inject } from 'vue';
import { useRouter } from 'vue-router';
import { ROUTES } from '@/plugins/router/constants';

const router = useRouter();
const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as TOpenDialog;

function back() {
  router.push(ROUTES.LOBBY);
}

function reload() {
  socket.emit(SOCKET_EVENTS.GET_ROOM_LIST);
}

function newRoom() {
  openDialog(DIALOG_ROUTES.NEW_GAME_ROOM, 'New Room');
}
</script>
