<template>
  <v-row :dense="true">
    <v-col>
      <icon-btn icon="mdi-eye-outline" color="info" :disabled="disabled || usedHint || !gameStore.playing" @click="showSongHint()">
        Show Song Hint
      </icon-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import IconBtn from '@/components/common/buttons/IconBtn.vue';
import { onUnmounted, ref } from 'vue';
import { useGameStore } from '@/plugins/store/game';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources/src/events';
import { TGamePlayerLifeLineType } from 'anime-quiz-shared-resources/src/models/types';
import { GamePlayerLifeLineType } from 'anime-quiz-shared-resources/src/models/game';

const gameStore = useGameStore();
const disabled = ref(true);
const usedHint = ref(false);

function showSongHint() {
  socket.emit(SOCKET_EVENTS.GAME_USE_LIFE_LINE, 'SONG_HINT');
}

socket.on(SOCKET_EVENTS.START_GAME, () => {
  usedHint.value = false;
});

socket.on(SOCKET_EVENTS.GAME_SHOW_LIFE_LINE, (_lifeLineType: TGamePlayerLifeLineType) => {
  const lifeLineType = GamePlayerLifeLineType.parse(_lifeLineType);
  if (lifeLineType === 'SONG_HINT') {
    usedHint.value = true;
  }
});

socket.on(SOCKET_EVENTS.GAME_NEW_ROUND, () => {
  disabled.value = true;
});

socket.on(SOCKET_EVENTS.GAME_START_COUNTDOWN, () => {
  disabled.value = false;
});

socket.on(SOCKET_EVENTS.GAME_SHOW_GUESS, () => {
  disabled.value = true;
});

socket.on(SOCKET_EVENTS.STOP_GAME, () => {
  disabled.value = true;
});

onUnmounted(() => {
  socket.off(SOCKET_EVENTS.START_GAME);
  socket.off(SOCKET_EVENTS.GAME_SHOW_LIFE_LINE);
  socket.off(SOCKET_EVENTS.GAME_NEW_ROUND);
  socket.off(SOCKET_EVENTS.GAME_START_COUNTDOWN);
  socket.off(SOCKET_EVENTS.GAME_SHOW_GUESS);
  socket.off(SOCKET_EVENTS.STOP_GAME);
});
</script>
