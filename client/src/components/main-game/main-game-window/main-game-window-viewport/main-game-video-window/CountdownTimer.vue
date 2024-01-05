<template>
  <v-progress-circular
    size="150"
    width="20"
    class="countdown-timer"
    v-show="show"
    :model-value="countdownPercentage()"
    :color="timerColor()"
  >
    {{ currentTime }}
  </v-progress-circular>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { socket } from '@/plugins/socket';

let timer: NodeJS.Timeout;

const show = ref(false);
const guessTime = ref(0);
const currentTime = ref(0);

function startCountdown() {
  timer = setInterval(() => {
    if (currentTime.value <= 0) {
      clearInterval(timer);
    }
    currentTime.value -= 1;
  }, 1000);
}

function countdownPercentage(): number {
  return (1 - currentTime.value / guessTime.value) * 100;
}

function timerColor(): string {
  const percentage = countdownPercentage();

  if (percentage >= 75) {
    return 'error';
  }

  if (percentage >= 50) {
    return 'warning';
  }

  return 'success';
}

socket.on(SOCKET_EVENTS.GAME_NEW_ROUND, () => {
  show.value = false;
});

socket.on(SOCKET_EVENTS.GAME_START_LOAD, (_startPosition: number, _guessTime: number) => {
  show.value = false;
  guessTime.value = _guessTime;
  currentTime.value = _guessTime;
});

socket.on(SOCKET_EVENTS.GAME_START_COUNTDOWN, () => {
  show.value = true;
  startCountdown();
});

socket.on(SOCKET_EVENTS.GAME_SHOW_GUESS, () => {
  show.value = false;
  clearInterval(timer);
});

socket.on(SOCKET_EVENTS.STOP_GAME, () => {
  clearInterval(timer);
});

onUnmounted(() => {
  clearInterval(timer);
  socket.off(SOCKET_EVENTS.GAME_NEW_ROUND);
  socket.off(SOCKET_EVENTS.GAME_START_LOAD);
  socket.off(SOCKET_EVENTS.GAME_START_COUNTDOWN);
  socket.off(SOCKET_EVENTS.GAME_SHOW_GUESS);
  socket.off(SOCKET_EVENTS.STOP_GAME);
});
</script>

<style scoped>
.countdown-timer {
  position: absolute;
  top: calc(50% - 75px);
  left: calc(50% - 75px);
  z-index: 9;
}
</style>
