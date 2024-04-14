<template>
  <v-row>
    <v-col cols="12" sm="6">
      <custom-combobox
        label="Anime"
        :items="dataStore.animeNames"
        v-model="guessInput.anime"
        persistent-hint
        :hint="`Selected Anime: ${gameStore.gameGuess.anime}`"
        variant="solo"
        flat
        :disabled="disabled"
        @keyup.enter.prevent="sendGuess()"
        @blur.prevent="sendGuess()"
      ></custom-combobox>
    </v-col>
    <v-col cols="12" sm="6">
      <custom-combobox
        label="Song Title"
        :items="dataStore.songTitles"
        v-model="guessInput.title"
        :hint="`Selected Song Title: ${gameStore.gameGuess.title}`"
        persistent-hint
        variant="solo"
        flat
        :disabled="disabled"
        @keyup.enter.prevent="sendGuess()"
        @blur.prevent="sendGuess()"
      ></custom-combobox>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import CustomCombobox from '@/components/common/inputs/CustomCombobox.vue';
import { onUnmounted, ref } from 'vue';
import { useDataStore } from '@/plugins/store/data';
import { useGameStore } from '@/plugins/store/game';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources';
import { socket } from '@/plugins/socket';

const dataStore = useDataStore();
const gameStore = useGameStore();

const disabled = ref(true);
const guessInput = ref({
  anime: '',
  title: ''
});

function sendGuess() {
  const guess = {
    anime: guessInput.value.anime.trim(),
    title: guessInput.value.title.trim()
  };
  socket.emit(SOCKET_EVENTS.GAME_EDIT_GUESS, guess);
}

socket.on(SOCKET_EVENTS.GAME_NEW_ROUND, () => {
  disabled.value = true;
  gameStore.updateGameGuess({
    anime: '',
    title: ''
  });
  guessInput.value.anime = '';
  guessInput.value.title = '';
});

socket.on(SOCKET_EVENTS.GAME_START_LOAD, () => {
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
  socket.off(SOCKET_EVENTS.GAME_NEW_ROUND);
  socket.off(SOCKET_EVENTS.GAME_START_LOAD);
  socket.off(SOCKET_EVENTS.GAME_START_COUNTDOWN);
  socket.off(SOCKET_EVENTS.GAME_SHOW_GUESS);
  socket.off(SOCKET_EVENTS.STOP_GAME);
});
</script>
