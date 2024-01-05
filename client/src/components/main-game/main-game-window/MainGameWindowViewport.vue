<template>
  <v-row>
    <v-col cols="12" sm="3"></v-col>
    <main-game-video-window></main-game-video-window>
    <main-game-song-info></main-game-song-info>
  </v-row>
</template>

<script setup lang="ts">
import MainGameVideoWindow from '@/components/main-game/main-game-window/main-game-window-viewport/MainGameVideoWindow.vue';
import MainGameSongInfo from '@/components/main-game/main-game-window/main-game-window-viewport/MainGameSongInfo.vue';
</script>
