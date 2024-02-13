<template>
  <v-sheet class="main-game-answer-container hint-answer-container">
    {{ getGameNameHint(gameStore.currentSong.animeName[0]) }}
  </v-sheet>
</template>

<script setup lang="ts">
import { useGameStore } from '@/plugins/store/game';
import { getGameNameHint } from '@/assets/game-helpers';

const gameStore = useGameStore();
</script>

<style scoped>
.hint-answer-container {
  letter-spacing: 2pt;
}
</style>
