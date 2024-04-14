<template>
  <v-col cols="12" sm="3">
    <v-card variant="flat">
      <v-list lines="two">
        <v-list-item title="Title" :subtitle="songTitle"></v-list-item>
        <v-list-item title="Artist" :subtitle="songArtist"></v-list-item>
        <v-list-item title="Type" :subtitle="songType"></v-list-item>
      </v-list>
    </v-card>
  </v-col>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
import { useGameStore } from '@/plugins/store/game';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources/src/events';
import { socket } from '@/plugins/socket';
import { TGamePlayerLifeLineType } from 'anime-quiz-shared-resources/src/models/types';
import { GamePlayerLifeLineType } from 'anime-quiz-shared-resources/src/models/game';
import { getGameNameHint } from '@/assets/game-helpers';

const gameStore = useGameStore();
const show = ref(false);
const showHint = ref(false);

socket.on(SOCKET_EVENTS.GAME_SHOW_LIFE_LINE, (_lifeLineType: TGamePlayerLifeLineType) => {
  const lifeLineType = GamePlayerLifeLineType.parse(_lifeLineType);
  if (lifeLineType === 'SONG_HINT') {
    showHint.value = true;
  }
});

const songTitle = computed((): string => {
  if (showHint.value) {
    return getGameNameHint(gameStore.currentSong.songTitle);
  }

  if (show.value) {
    return gameStore.currentSong.songTitle;
  }
  return '?';
});

const songArtist = computed((): string => {
  if (show.value || showHint.value) {
    return gameStore.currentSong.artist || '';
  }
  return '?';
});

const songType = computed((): string => {
  if (show.value || showHint.value) {
    return gameStore.currentSong.type;
  }
  return '?';
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

onUnmounted(() => {
  socket.off(SOCKET_EVENTS.GAME_NEW_ROUND);
  socket.off(SOCKET_EVENTS.GAME_SHOW_GUESS);
  socket.off(SOCKET_EVENTS.STOP_GAME);
});
</script>
