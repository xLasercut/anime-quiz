<template>
  <nav-btn icon="mdi-plus" color="success" @click="newAnime()">New Anime</nav-btn>
  <nav-btn icon="mdi-refresh" color="info" @click="reload()">Reload</nav-btn>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { DIALOG_ROUTES } from '@/assets/routing/routes';
import { TOpenDialog } from '@/assets/types';
import { CLIENT_EVENTS } from '@/assets/events';
import { useAdminStore } from '@/plugins/store/admin';
import { DATABASE_EDIT_MODE } from '@/assets/constants';
import { useDataStore } from '@/plugins/store/data';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources';
import { inject } from 'vue';
import { useRouter } from 'vue-router';
import { ROUTES } from '@/plugins/router/constants';

const adminStore = useAdminStore();
const dataStore = useDataStore();
const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as TOpenDialog;
const router = useRouter();

function back() {
  router.push(ROUTES.LOBBY);
}

function newAnime() {
  adminStore.updateAnimeInEdit({
    animeId: '',
    animeName: []
  });
  adminStore.generateNewAnimeId();
  adminStore.updateEditMode(DATABASE_EDIT_MODE.NEW);
  openDialog(DIALOG_ROUTES.ANIME_EDIT, 'New Anime');
}

function reload() {
  dataStore.updateAnimeNames([]);
  dataStore.updateAnimeList([]);
  socket.emit(SOCKET_EVENTS.UPDATE_STORE_ANIME_NAMES);
  socket.emit(SOCKET_EVENTS.UPDATE_STORE_ANIME_LIST);
}
</script>
