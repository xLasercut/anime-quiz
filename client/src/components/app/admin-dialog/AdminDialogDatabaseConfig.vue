<template>
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
</template>

<script setup lang="ts">
import IconBtn from '@/components/common/buttons/IconBtn.vue';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';

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
