<template>
  <v-row justify="center">
    <v-col cols="auto" v-for="player in gameStore.playerList">
      <v-menu
        location="top"
        min-width="150px"
        max-width="150px"
        v-model="showGuess"
        :open-on-click="false"
        :open-on-focus="false"
        :open-on-hover="false"
        transition="fade-transition"
      >
        <template #activator="{ props }">
          <div class="player-container" v-bind="props">
            <v-row justify="center">
              <game-avatar :avatar="player.avatar" size="100"></game-avatar>
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
        <v-sheet class="player-guess">
          {{ playerGuess(player) }}
        </v-sheet>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useGameStore } from '@/plugins/store/game';
import GameAvatar from '@/components/common/GameAvatar.vue';
import { GamePlayerType } from '@/assets/shared/models/types';
import { ref } from 'vue';

const gameStore = useGameStore();

const showGuess = ref(false);

function playerGuess(player: GamePlayerType): string {
  return `${player.guess.anime || '...'} - ${player.guess.title || '...'}`;
}
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
