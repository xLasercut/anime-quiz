<template>
  <nav-btn icon="mdi-refresh" color="info" @click="reload()">Reload</nav-btn>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';

import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources';
import { useDataStore } from '@/plugins/store/data';
import { useRouter } from 'vue-router';
import { ROUTES } from '@/plugins/router/constants';

const dataStore = useDataStore();
const router = useRouter();

function back() {
  router.push(ROUTES.LOBBY);
}

function reload() {
  dataStore.updateUserSongList([]);
  dataStore.updateSongTitles([]);
  dataStore.updateSongList([]);
  dataStore.updateAnimeNames([]);
  socket.emit(SOCKET_EVENTS.UPDATE_STORE_ANIME_NAMES);
  socket.emit(SOCKET_EVENTS.UPDATE_STORE_SONG_LIST);
  socket.emit(SOCKET_EVENTS.UPDATE_STORE_SONG_TITLES);
  socket.emit(SOCKET_EVENTS.UPDATE_STORE_USER_SONG_LIST);
}
</script>
