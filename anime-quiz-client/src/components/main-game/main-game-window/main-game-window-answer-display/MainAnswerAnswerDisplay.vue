<template>
  <v-menu location="bottom" :open-on-hover="true" :open-delay="0" :close-delay="0">
    <template #activator="{ props }">
      <v-sheet class="answer-container" v-bind="props">{{ gameStore.currentSong.animeName[0] }} </v-sheet>
    </template>
    <v-list density="compact">
      <v-list-item v-for="name in gameStore.currentSong.animeName" :title="name" density="compact"></v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { useGameStore } from '@/plugins/store/game';

const gameStore = useGameStore();
</script>

<style scoped>
.answer-container {
  font-size: 16pt;
  text-align: center;
  border-radius: 5px;
  padding: 5px;
}
</style>
