<template>
  <nav-btn icon="mdi-refresh" color="info" @click="reload()">Reload</nav-btn>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { useClientStore } from '@/plugins/store/client';
import { ROUTES } from '@/assets/routing/routes';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { useDataStore } from '@/plugins/store/data';

const clientStore = useClientStore();
const dataStore = useDataStore();

function back() {
  clientStore.changeView(ROUTES.LOBBY);
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
