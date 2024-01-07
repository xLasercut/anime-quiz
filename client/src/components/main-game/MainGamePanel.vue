<template>
  <nav-btn color="primary" icon="mdi-playlist-music" @click="openSongPicker()" v-if="clientStore.clientData.admin"> Song </nav-btn>
  <panel-volume-slider></panel-volume-slider>
  <nav-btn icon="mdi-stop" color="error" @click="stopGame()" v-if="showStopBtn()">Stop</nav-btn>
  <nav-btn icon="mdi-play" color="success" @click="startGame()" v-if="showStartBtn()">Start</nav-btn>
  <nav-btn icon="mdi-cog" color="primary" @click="openSettings()">Settings</nav-btn>
  <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
</template>

<script setup lang="ts">
import NavBtn from '@/components/common/buttons/NavBtn.vue';
import { useClientStore } from '@/plugins/store/client';
import { DIALOG_ROUTES, ROUTES } from '@/assets/routing/routes';
import { inject } from 'vue';
import { CLIENT_EVENTS } from '@/assets/events';
import { OpenDialog } from '@/assets/types';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { useGameStore } from '@/plugins/store/game';
import PanelVolumeSlider from '@/components/common/panel/PanelVolumeSlider.vue';

const clientStore = useClientStore();
const gameStore = useGameStore();
const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as OpenDialog;

function openSettings() {
  socket.emit(SOCKET_EVENTS.GET_GAME_ROOM_SETTINGS);
  openDialog(DIALOG_ROUTES.MAIN_GAME_SETTINGS, 'Game Settings');
}

function openSongPicker() {
  openDialog(DIALOG_ROUTES.MAIN_GAME_SONG_PICKER, 'Song Picker');
}

function back() {
  clientStore.changeView(ROUTES.GAME_ROOMS);
}

function startGame() {
  socket.emit(SOCKET_EVENTS.START_GAME);
}

function stopGame() {
  socket.emit(SOCKET_EVENTS.STOP_GAME);
}

function showStartBtn(): boolean {
  return (clientStore.clientData.host || clientStore.clientData.admin) && !gameStore.playing;
}

function showStopBtn(): boolean {
  return (clientStore.clientData.host || clientStore.clientData.admin) && gameStore.playing;
}
</script>
