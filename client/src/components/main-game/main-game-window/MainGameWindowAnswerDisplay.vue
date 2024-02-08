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
import { GamePlayerLifeLineTypeType } from '@/assets/shared/models/types';
import { GamePlayerLifeLineType } from '@/assets/shared/models/game';
import MainAnswerHintDisplay from '@/components/main-game/main-game-window/main-game-window-answer-display/MainAnswerHintDisplay.vue';

const gameStore = useGameStore();
const show = ref(false);
const showHint = ref(false);

socket.on(SOCKET_EVENTS.GAME_SHOW_LIFE_LINE, (_lifeLineType: GamePlayerLifeLineTypeType) => {
  const lifeLineType = GamePlayerLifeLineType.parse(_lifeLineType);
  if (lifeLineType === 'ANIME_HINT') {
    showHint.value = true;
  }
});

socket.on(SOCKET_EVENTS.GAME_NEW_ROUND, () => {
  show.value = false;
  showHint.value = false;
});

socket.on(SOCKET_EVENTS.GAME_SHOW_GUESS, () => {
  show.value = true;
  showHint.value = false;
});

socket.on(SOCKET_EVENTS.STOP_GAME, () => {
  showHint.value = false;
});

function answerDisplay() {
  if (showHint.value) {
    return MainAnswerHintDisplay;
  }

  if (show.value) {
    return MainAnswerAnswerDisplay;
  }
  return MainAnswerQuestionDisplay;
}

onUnmounted(() => {
  socket.off(SOCKET_EVENTS.GAME_NEW_ROUND);
  socket.off(SOCKET_EVENTS.GAME_SHOW_GUESS);
  socket.off(SOCKET_EVENTS.GAME_SHOW_LIFE_LINE);
  socket.off(SOCKET_EVENTS.STOP_GAME);
});
</script>

<style scoped>
.count-container {
  border-radius: 20px 20px 0 0;
  text-align: center;
}
</style>
