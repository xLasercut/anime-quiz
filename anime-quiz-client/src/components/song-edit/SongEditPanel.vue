<template>
  <nav-btn icon="mdi-plus" color="success" @click="newSong()">New Song</nav-btn>
  <nav-btn icon="mdi-refresh" color="info" @click="reload()">Reload</nav-btn>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { useClientStore } from '@/plugins/store/client';
import { DIALOG_ROUTES, ROUTES } from '@/assets/routing/routes';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { useDataStore } from '@/plugins/store/data';
import { useAdminStore } from '@/plugins/store/admin';
import { OpenDialog } from '@/assets/types';
import { CLIENT_EVENTS } from '@/assets/events';
import { DATABASE_EDIT_MODE } from '@/assets/constants';
import { inject } from 'vue';

const clientStore = useClientStore();
const dataStore = useDataStore();
const adminStore = useAdminStore();
const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as OpenDialog;

function newSong() {
  adminStore.updateSongInEdit({
    songId: '',
    animeName: ['New Song'],
    animeId: [],
    src: '',
    songTitle: '',
    artist: '',
    type: 'OP'
  });
  adminStore.generateNewSongId();
  adminStore.updateEditMode(DATABASE_EDIT_MODE.NEW);
  openDialog(DIALOG_ROUTES.SONG_EDIT, 'New Song');
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

function back() {
  clientStore.changeView(ROUTES.LOBBY);
}
</script>
