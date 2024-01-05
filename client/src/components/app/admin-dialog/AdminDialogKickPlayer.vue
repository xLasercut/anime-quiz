<template>
  <v-row>
    <v-col cols="12">
      <v-select
        :items="gameStore.playerList"
        label="Kick Player"
        :clearable="true"
        v-model.trim="playerToKick"
        variant="outlined"
        item-value="socketId"
        :hint="`Selected: ${playerToKick}`"
        append-icon="mdi-cancel"
        @click:append="kickPlayer()"
      >
        <template #item="{ item, props }">
          <v-list-item @click="props.onClick">
            <template #prepend>
              <game-avatar :size="avatarSize" :avatar="item.raw.avatar"></game-avatar>
            </template>
            <v-list-item-title v-text="playerText(item.raw)"></v-list-item-title>
          </v-list-item>
        </template>

        <template #selection="{ item }">
          <v-list-item v-if="item.raw">
            <template #prepend>
              <game-avatar :size="avatarSize" :avatar="item.raw.avatar"></game-avatar>
            </template>
            <v-list-item-title v-text="playerText(item.raw)"></v-list-item-title>
          </v-list-item>
        </template>
      </v-select>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import GameAvatar from '@/components/common/GameAvatar.vue';
import { useGameStore } from '@/plugins/store/game';
import { ref } from 'vue';
import { GamePlayerType } from '@/assets/shared/models/types';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';

const gameStore = useGameStore();
const playerToKick = ref('');
const avatarSize = ref('50');

function playerText(player: GamePlayerType): string {
  return `${player.displayName} - ${player.socketId}`;
}

function kickPlayer() {
  socket.emit(SOCKET_EVENTS.ADMIN_GAME_KICK_PLAYER, playerToKick.value);
}
</script>
