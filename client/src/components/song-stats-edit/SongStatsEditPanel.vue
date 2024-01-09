<template>
  <nav-btn icon="mdi-refresh" color="info" @click="reload()">Reload</nav-btn>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { ROUTES } from '@/assets/routing/routes';
import { useClientStore } from '@/plugins/store/client';
import { useDataStore } from '@/plugins/store/data';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { socket } from '@/plugins/socket';

const clientStore = useClientStore();
const dataStore = useDataStore();

function reload() {
  dataStore.updateSongStatsList([]);
  socket.emit(SOCKET_EVENTS.UPDATE_STORE_SONG_STATS_LIST);
}

function back() {
  clientStore.changeView(ROUTES.LOBBY);
}
</script>
