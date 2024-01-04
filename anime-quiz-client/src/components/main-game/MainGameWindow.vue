<template>
  <v-col cols="7" md="8">
    <main-game-window-answer-display></main-game-window-answer-display>
    <main-game-window-viewport></main-game-window-viewport>
    <main-game-window-guess-input></main-game-window-guess-input>
    <main-game-window-players></main-game-window-players>
  </v-col>
</template>

<script setup lang="ts">
import MainGameWindowAnswerDisplay from '@/components/main-game/main-game-window/MainGameWindowAnswerDisplay.vue';
import MainGameWindowGuessInput from '@/components/main-game/main-game-window/MainGameWindowGuessInput.vue';
import MainGameWindowPlayers from '@/components/main-game/main-game-window/MainGameWindowPlayers.vue';
import MainGameWindowViewport from '@/components/main-game/main-game-window/MainGameWindowViewport.vue';
</script>
