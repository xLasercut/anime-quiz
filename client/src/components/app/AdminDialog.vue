<template>
  <v-container :fluid="true">
    <v-row justify="center" :dense="true">
      <v-col cols="auto"> Client Version: {{ CLIENT_VERSION }} </v-col>
    </v-row>
    <v-row justify="center" :dense="true">
      <v-col cols="auto">
        <icon-btn icon="mdi-lock" color="warning" @click="lockDatabase()">Lock Database</icon-btn>
      </v-col>
      <v-col cols="auto">
        <icon-btn icon="mdi-lock-open-variant" color="success" @click="unlockDatabase()">Unlock Database</icon-btn>
      </v-col>
      <v-col cols="auto">
        <icon-btn icon="mdi-reload" color="primary" @click="reloadDatabase()">Reload Database</icon-btn>
      </v-col>
    </v-row>
    <v-row :dense="true">
      <v-col cols="auto">
        {{ gameStore.currentSong }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import IconBtn from '@/components/common/buttons/IconBtn.vue';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { socket } from '@/plugins/socket';
import { useGameStore } from '@/plugins/store/game';
import { CLIENT_VERSION } from '@/assets/constants';

const gameStore = useGameStore();

function lockDatabase() {
  socket.emit(SOCKET_EVENTS.ADMIN_LOCK_DATABASE);
}

function unlockDatabase() {
  socket.emit(SOCKET_EVENTS.ADMIN_UNLOCK_DATABASE);
}

function reloadDatabase() {
  socket.emit(SOCKET_EVENTS.ADMIN_RELOAD_DATABASE);
}
</script>
