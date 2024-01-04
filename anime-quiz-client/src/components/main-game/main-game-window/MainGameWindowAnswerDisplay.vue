<template>
  <v-row>
    <v-col cols="12">
      <v-row no-gutters justify="center">
        <v-col cols="5" sm="3" md="2">
          <v-sheet class="count-container"> {{ gameStore.currentSongCount }} / {{ gameStore.maxSongCount }}</v-sheet>
        </v-col>
      </v-row>
      <v-row no-gutters justify="center">
        <v-col cols="12" sm="8" md="6" lg="5">
          <component :is="answerDisplay()"></component>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import MainAnswerAnswerDisplay from '@/components/main-game/main-game-window/main-game-window-answer-display/MainAnswerAnswerDisplay.vue';
import { onUnmounted, ref } from 'vue';
import MainAnswerQuestionDisplay from '@/components/main-game/main-game-window/main-game-window-answer-display/MainAnswerQuestionDisplay.vue';
import { useGameStore } from '@/plugins/store/game';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { socket } from '@/plugins/socket';

const gameStore = useGameStore();
const show = ref(false);

socket.on(SOCKET_EVENTS.GAME_NEW_ROUND, () => {
  show.value = false;
});

function answerDisplay() {
  if (show.value) {
    return MainAnswerAnswerDisplay;
  }
  return MainAnswerQuestionDisplay;
}

onUnmounted(() => {
  socket.off(SOCKET_EVENTS.GAME_NEW_ROUND);
});
</script>

<style scoped>
.count-container {
  border-radius: 20px 20px 0 0;
  text-align: center;
}
</style>
