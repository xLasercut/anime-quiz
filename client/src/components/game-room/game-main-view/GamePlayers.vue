<template>
  <v-row justify="center">
    <v-col v-for="player in $store.state.game.players" cols="auto" :key="player.sid">
      <div :style="playerContainerStyle()">
        <v-row no-gutters justify="center">
          <v-tooltip top v-model="show" :color="player.scoreColor" min-width="150" max-width="150">
            <template #activator="{ on }">
              <v-badge tile overlap dot :color="badgeColor(player)">
                <game-avatar :avatar="player.avatar" :size="100"></game-avatar>
              </v-badge>
            </template>
            {{ player.guess.anime || '...' }} - {{ player.guess.title || '...' }}
          </v-tooltip>
        </v-row>
        <v-row no-gutters justify="center">
          <v-sheet class="player-name">
            {{ player.username }}
          </v-sheet>
        </v-row>
        <v-row no-gutters justify="center">
          <v-sheet class="player-score">
            {{ player.score }}
          </v-sheet>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, reactive, toRefs } from '@vue/composition-api';
import { IGamePlayer } from '../../../assets/shared/interfaces';
import GameAvatar from '../../shared/GameAvatar.vue';
import { socket } from '../../../plugins/socket';
import { SHARED_EVENTS } from '../../../assets/shared/events';

interface State {
  players: IGamePlayer[];
  show: boolean;
}

export default defineComponent({
  components: { GameAvatar },
  setup() {
    const state = reactive<State>({
      players: [],
      show: false
    });

    socket.on(SHARED_EVENTS.GAME_NEW_ROUND, () => {
      state.show = false;
    });

    socket.on(SHARED_EVENTS.GAME_SHOW_GUESS, () => {
      state.show = true;

      setTimeout(() => {
        state.show = false;
      }, 8000);
    });

    function badgeColor(player: IGamePlayer): string {
      if (player.admin) {
        return 'warning';
      }

      if (player.host) {
        return 'info';
      }

      return 'primary';
    }

    function playerContainerStyle() {
      return {
        width: '150px'
      };
    }

    onUnmounted(() => {
      socket.off(SHARED_EVENTS.GAME_NEW_ROUND);
      socket.off(SHARED_EVENTS.GAME_SHOW_GUESS);
    });

    return {
      ...toRefs(state),
      badgeColor,
      playerContainerStyle
    };
  }
});
</script>

<style scoped>
.player-name {
  min-width: 100px;
  max-width: 100px;
  font-size: 11pt;
  border-radius: 5px;
  word-wrap: break-word;
  text-align: center;
}

.player-score {
  min-width: 50px;
  max-width: 50px;
  font-size: 11pt;
  border-radius: 0 0 25px 25px;
  text-align: center;
}
</style>
