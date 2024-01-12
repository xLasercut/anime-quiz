<template>
  <v-col cols="12" sm="6">
    <v-row justify="center">
      <v-sheet class="video-container">
        <loading-circle :color="loadingCircleColor"></loading-circle>
        <countdown-timer></countdown-timer>
        <video-player @update:loading-color="loadingCircleColor = $event"></video-player>
      </v-sheet>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import LoadingCircle from '@/components/main-game/main-game-window/main-game-window-viewport/main-game-video-window/LoadingCircle.vue';
import VideoPlayer from '@/components/main-game/main-game-window/main-game-window-viewport/main-game-video-window/VideoPlayer.vue';
import CountdownTimer from '@/components/main-game/main-game-window/main-game-window-viewport/main-game-video-window/CountdownTimer.vue';
import { onUnmounted, ref } from 'vue';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';

const loadingCircleColor = ref('primary');

socket.on(SOCKET_EVENTS.GAME_NEW_ROUND, () => {
  loadingCircleColor.value = 'primary';
});

onUnmounted(() => {
  socket.off(SOCKET_EVENTS.GAME_NEW_ROUND);
});
</script>

<style scoped>
.video-container {
  position: relative;
  width: 400px;
  max-width: 400px;
  border-radius: 5px;
  height: 225px;
  max-height: 225px;
}
</style>
