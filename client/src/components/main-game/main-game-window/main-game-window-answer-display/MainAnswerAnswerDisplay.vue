<template>
  <v-menu location="bottom" :open-on-hover="true" :open-delay="0" :close-delay="0" transition="fade-transition" max-width="100%">
    <template #activator="{ props }">
      <v-sheet class="answer-container" v-bind="props">{{ gameStore.currentSong.animeName[0] }}</v-sheet>
    </template>
    <v-sheet>
      <v-container :fluid="true">
        <v-row v-for="name in gameStore.currentSong.animeName" :dense="true">
          <v-col cols="auto">{{ name }}</v-col>
        </v-row>
      </v-container>
    </v-sheet>
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
