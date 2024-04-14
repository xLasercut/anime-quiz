<template>
  <div class="audio-only-prompt" v-show="show">
    <h1>Audio Only</h1>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources';
import { useClientStore } from '@/plugins/store/client';
import { useGameStore } from '@/plugins/store/game';

const clientStore = useClientStore();
const gameStore = useGameStore();
const show = ref(false);

socket.on(SOCKET_EVENTS.GAME_NEW_ROUND, () => {
  show.value = false;
});

socket.on(SOCKET_EVENTS.GAME_SHOW_GUESS, () => {
  if (clientStore.audioOnly && gameStore.currentSong.audioSrc === gameStore.currentSong.currentSongSrc) {
    show.value = true;
  }
});

socket.on(SOCKET_EVENTS.STOP_GAME, () => {
  show.value = false;
});

onUnmounted(() => {
  socket.off(SOCKET_EVENTS.GAME_NEW_ROUND);
  socket.off(SOCKET_EVENTS.GAME_SHOW_GUESS);
  socket.off(SOCKET_EVENTS.STOP_GAME);
});
</script>

<style scoped>
.audio-only-prompt {
  height: 100%;
  width: 100%;
  text-align: center;
  line-height: 225px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
}
</style>
