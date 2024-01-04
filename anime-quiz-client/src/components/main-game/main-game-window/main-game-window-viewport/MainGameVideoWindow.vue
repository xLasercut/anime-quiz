<template>
  <v-col cols="12" sm="6">
    <v-row justify="center">
      <v-col cols="12" align-self="center" :style="styles">
        <loading-circle></loading-circle>
        <video-player></video-player>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import LoadingCircle from '@/components/main-game/main-game-window/main-game-window-viewport/main-game-video-window/LoadingCircle.vue';
import { computed } from 'vue';
import VideoPlayer from '@/components/main-game/main-game-window/main-game-window-viewport/main-game-video-window/VideoPlayer.vue';

const styles = computed(() => {
  return {
    ['text-align']: 'center'
  };
});
</script>
