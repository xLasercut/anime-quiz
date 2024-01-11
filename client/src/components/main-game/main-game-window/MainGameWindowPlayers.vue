<template>
  <v-row justify="center">
    <v-col cols="auto" v-for="player in gameStore.playerList">
      <game-tooltip location="top" :open-on-hover="false" v-model="show">
        <template #activator>
          <div class="player-container">
            <v-row justify="center">
              <v-badge :dot="true" :color="badgeColor(player)">
                <game-avatar :avatar="player.avatar" size="100"></game-avatar>
              </v-badge>
            </v-row>
            <v-row justify="center">
              <v-sheet class="player-name">
                {{ player.displayName }}
              </v-sheet>
            </v-row>
            <v-row justify="center">
              <v-sheet class="player-score">
                {{ player.score }}
              </v-sheet>
            </v-row>
          </div>
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
import { GamePlayerType } from '@/assets/shared/models/types';
import { onUnmounted, ref } from 'vue';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { socket } from '@/plugins/socket';
import GameTooltip from '@/components/common/GameTooltip.vue';

const gameStore = useGameStore();

let timeout: NodeJS.Timeout;
const show = ref(false);

function playerGuess(player: GamePlayerType): string {
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

function badgeColor(player: GamePlayerType): string {
  if (player.admin) {
    return 'warning';
  }

  if (player.host) {
    return 'primary';
  }

  return 'info';
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
.player-container {
  min-width: 150px;
  max-width: 150px;
}

.player-guess {
  min-width: 150px;
  max-width: 150px;
  word-wrap: break-word;
  text-align: center;
  padding: 2px;
  border-radius: 4px;
}

.player-name {
  min-width: 100px;
  max-width: 100px;
  font-size: 11pt;
  border-radius: 5px;
  word-wrap: break-word;
  text-align: center;
  margin-top: 5px;
}

.player-score {
  min-width: 50px;
  max-width: 50px;
  font-size: 11pt;
  border-radius: 0 0 25px 25px;
  text-align: center;
}
</style>
