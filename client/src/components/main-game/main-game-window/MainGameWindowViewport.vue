<template>
  <v-row>
    <main-game-player-tools></main-game-player-tools>
    <main-game-video-window></main-game-video-window>
    <main-game-song-info></main-game-song-info>
  </v-row>
</template>

<script setup lang="ts">
import MainGameVideoWindow from '@/components/main-game/main-game-window/main-game-window-viewport/MainGameVideoWindow.vue';
import MainGameSongInfo from '@/components/main-game/main-game-window/main-game-window-viewport/MainGameSongInfo.vue';
import MainGamePlayerTools from '@/components/main-game/main-game-window/main-game-window-viewport/MainGamePlayerTools.vue';
</script>
