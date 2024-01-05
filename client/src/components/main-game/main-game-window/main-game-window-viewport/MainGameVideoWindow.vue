<template>
  <v-col cols="12" sm="6">
    <v-row justify="center">
      <v-sheet class="video-container">
        <loading-circle></loading-circle>
        <countdown-timer></countdown-timer>
        <video-player></video-player>
      </v-sheet>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import LoadingCircle from '@/components/main-game/main-game-window/main-game-window-viewport/main-game-video-window/LoadingCircle.vue';
import VideoPlayer from '@/components/main-game/main-game-window/main-game-window-viewport/main-game-video-window/VideoPlayer.vue';
import CountdownTimer from '@/components/main-game/main-game-window/main-game-window-viewport/main-game-video-window/CountdownTimer.vue';
</script>

<style scoped>
.video-container {
  position: relative;
  width: 400px;
  max-width: 400px;
  border-radius: 3px;
}
</style>
