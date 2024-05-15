<template>
  <nav-btn icon="mdi-plus" color="success" @click="newSongStats()" v-if="clientStore.clientData.admin">New Song Stats </nav-btn>
  <nav-btn icon="mdi-refresh" color="info" @click="reload()">Reload</nav-btn>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { DIALOG_ROUTES } from '@/assets/routing/routes';
import { useClientStore } from '@/plugins/store/client';
import { useDataStore } from '@/plugins/store/data';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources';
import { socket } from '@/plugins/socket';
import { useAdminStore } from '@/plugins/store/admin';
import { inject } from 'vue';
import { CLIENT_EVENTS } from '@/assets/events';
import { TOpenDialog } from '@/assets/types';
import { DATABASE_EDIT_MODE } from '@/assets/constants';
import { useRouter } from 'vue-router';
import { ROUTES } from '@/plugins/router/constants';

const clientStore = useClientStore();
const dataStore = useDataStore();
const adminStore = useAdminStore();
const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as TOpenDialog;
const router = useRouter();

function newSongStats() {
  adminStore.updateSongStatsInEdit({
    songId: '',
    playCount: 0
  });
  adminStore.updateEditMode(DATABASE_EDIT_MODE.NEW);
  openDialog(DIALOG_ROUTES.SONG_STATS_EDIT, 'New Song Stats');
}

function reload() {
  dataStore.updateSongStatsRecords({});
  socket.emit(SOCKET_EVENTS.UPDATE_STORE_SONG_STATS_RECORDS);
}

function back() {
  router.push(ROUTES.LOBBY);
}
</script>
