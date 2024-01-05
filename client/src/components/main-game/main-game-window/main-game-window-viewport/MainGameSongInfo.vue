<template>
  <v-col cols="12" sm="3">
    <v-card variant="flat">
      <v-list lines="two">
        <v-list-item title="Title" :subtitle="show ? gameStore.currentSong.songTitle : '?'"> </v-list-item>
        <v-list-item title="Artist" :subtitle="show ? gameStore.currentSong.artist : '?'"> </v-list-item>
        <v-list-item title="Type" :subtitle="show ? gameStore.currentSong.type : '?'"> </v-list-item>
      </v-list>
    </v-card>
  </v-col>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { useGameStore } from '@/plugins/store/game';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { socket } from '@/plugins/socket';

const gameStore = useGameStore();
const show = ref(false);

socket.on(SOCKET_EVENTS.GAME_NEW_ROUND, () => {
  show.value = false;
});

socket.on(SOCKET_EVENTS.GAME_SHOW_GUESS, () => {
  show.value = true;
});

onUnmounted(() => {
  socket.off(SOCKET_EVENTS.GAME_NEW_ROUND);
  socket.off(SOCKET_EVENTS.GAME_SHOW_GUESS);
});
</script>
