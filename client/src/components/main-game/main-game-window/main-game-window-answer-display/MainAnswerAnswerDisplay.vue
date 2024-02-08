<template>
  <game-tooltip location="bottom" :open-on-hover="true" width="100%">
    <template #activator>
      <v-sheet class="main-game-answer-container">{{ gameStore.currentSong.animeName[0] }}</v-sheet>
    </template>
    <v-sheet class="alt-name-container">
      <v-container :fluid="true">
        <v-row v-for="name in gameStore.currentSong.animeName" :dense="true">
          <v-col cols="auto">{{ name }}</v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </game-tooltip>
</template>

<script setup lang="ts">
import { useGameStore } from '@/plugins/store/game';
import GameTooltip from '@/components/common/GameTooltip.vue';

const gameStore = useGameStore();
</script>

<style scoped>
.alt-name-container {
  border-radius: 4px;
}
</style>
