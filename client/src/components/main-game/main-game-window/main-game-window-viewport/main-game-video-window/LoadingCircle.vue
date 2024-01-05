<template>
  <v-progress-circular size="150" :width="5" indeterminate color="primary" v-show="show" class="loading-spinner"></v-progress-circular>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';

const show = ref(false);

socket.on(SOCKET_EVENTS.GAME_NEW_ROUND, () => {
  show.value = false;
});

socket.on(SOCKET_EVENTS.GAME_START_LOAD, () => {
  show.value = true;
});

socket.on(SOCKET_EVENTS.GAME_START_COUNTDOWN, () => {
  show.value = false;
});

socket.on(SOCKET_EVENTS.GAME_SHOW_GUESS, () => {
  show.value = false;
});

onUnmounted(() => {
  socket.off(SOCKET_EVENTS.GAME_NEW_ROUND);
  socket.off(SOCKET_EVENTS.GAME_START_LOAD);
  socket.off(SOCKET_EVENTS.GAME_START_COUNTDOWN);
  socket.off(SOCKET_EVENTS.GAME_SHOW_GUESS);
});
</script>

<style scoped>
.loading-spinner {
  position: absolute;
  top: calc(50% - 75px);
  left: calc(50% - 75px);
  z-index: 10;
}
</style>
