<template>
  <v-row justify="center" :dense="true">
    <v-col cols="auto" v-for="player in gameStore.playerList">
      <game-tooltip location="top" :open-on-hover="false" v-model="show">
        <template #activator>
          <v-sheet rounded="lg" :width="playerCardWidth">
            <v-row justify="center" :dense="true">
              <game-avatar :avatar="player.avatar" :size="playerCardWidth" rounded="t-lg b-0"></game-avatar>
            </v-row>
            <v-row justify="space-between" no-gutters :dense="true">
              <v-col cols="12">
                <div class="player-name">
                  {{ player.displayName }}
                </div>
              </v-col>
              <v-col cols="auto">
                <v-icon :color="badgeColor(player)" size="x-small" icon="mdi-circle"></v-icon>
              </v-col>
              <v-col cols="auto">
                <div class="player-score">{{ player.score }}</div>
              </v-col>
              <v-col cols="auto">
                <v-icon :color="skipIconColor(player)" size="x-small" :icon="skipIcon(player)"></v-icon>
              </v-col>
            </v-row>
          </v-sheet>
        </template>
        <v-sheet class="player-guess" :color="player.scoreColor">
          {{ playerGuess(player) }}
        </v-sheet>
      </game-tooltip>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useGameStore } from '@/plugins/store/game';
import GameAvatar from '@/components/common/GameAvatar.vue';
import { TGamePlayer } from 'anime-quiz-shared-resources/src/models/types';
import { onUnmounted, ref } from 'vue';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources/src/events';
import { socket } from '@/plugins/socket';
import GameTooltip from '@/components/common/GameTooltip.vue';

const gameStore = useGameStore();

let timeout: NodeJS.Timeout;
const show = ref(false);
const playerCardWidth = ref('150');

function playerGuess(player: TGamePlayer): string {
  return `${player.guess.anime || '...'} - ${player.guess.title || '...'}`;
}

function showGuess() {
  if (show.value) {
    show.value = false;
  }
  show.value = true;
  timeout = setTimeout(() => {
    show.value = false;
    clearTimeout(timeout);
  }, 8000);
}

function badgeColor(player: TGamePlayer): string {
  if (player.admin) {
    return 'warning';
  }

  if (player.host) {
    return 'primary';
  }

  return 'info';
}

function skipIconColor(player: TGamePlayer): string {
  if (player.skipSong) {
    return 'success';
  }
  return 'error';
}

function skipIcon(player: TGamePlayer): string {
  if (player.skipSong) {
    return 'mdi-check';
  }
  return 'mdi-close';
}

socket.on(SOCKET_EVENTS.GAME_NEW_ROUND, () => {
  show.value = false;
});

socket.on(SOCKET_EVENTS.GAME_SHOW_GUESS, () => {
  showGuess();
});

onUnmounted(() => {
  socket.off(SOCKET_EVENTS.GAME_NEW_ROUND);
  socket.off(SOCKET_EVENTS.GAME_SHOW_GUESS);
  clearTimeout(timeout);
});
</script>

<style scoped>
.player-guess {
  min-width: 150px;
  max-width: 150px;
  word-wrap: break-word;
  text-align: center;
  padding: 2px;
  border-radius: 4px;
}

.player-name {
  width: 150px;
  font-size: 11pt;
  word-wrap: break-word;
  text-align: center;
  font-weight: bold;
}

.player-score {
  width: 100px;
  font-size: 11pt;
  text-align: center;
  font-weight: bold;
  word-wrap: break-word;
}
</style>
