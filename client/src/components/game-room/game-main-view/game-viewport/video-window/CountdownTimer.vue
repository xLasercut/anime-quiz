<template>
  <v-progress-circular
    :size="100"
    :width="10"
    :rotate="270"
    :value="percentage()"
    :color="color()"
    v-show="show"
  >
    {{ time }}
  </v-progress-circular>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, reactive, toRefs } from '@vue/composition-api';
import { socket } from '../../../../../plugins/socket';
import { SHARED_EVENTS } from '../../../../../assets/shared/events';

interface State {
  show: boolean;
  time: number;
  guessTime: number;
  countdown: number;
}

export default defineComponent({
  setup() {
    const state = reactive<State>({
      show: false,
      time: 0,
      guessTime: 1,
      countdown: 0
    });

    socket.on(SHARED_EVENTS.GAME_NEW_ROUND, () => {
      state.show = false;
    });

    socket.on(SHARED_EVENTS.GAME_START_LOAD, (_startPosition: number, guessTime: number) => {
      state.show = false;
      state.guessTime = guessTime;
      state.time = guessTime;
      clearInterval(state.countdown);
    });

    socket.on(SHARED_EVENTS.GAME_START_COUNTDOWN, () => {
      state.countdown = setInterval(() => {
        state.time -= 1;
        if (state.time <= 0) {
          clearInterval(state.countdown);
        }
      }, 1000);
      state.show = true;
    });

    socket.on(SHARED_EVENTS.GAME_SHOW_GUESS, () => {
      clearInterval(state.countdown);
      state.show = false;
    });

    socket.on(SHARED_EVENTS.STOP_CLIENT_GAME, () => {
      clearInterval(state.countdown);
    });

    function percentage(): number {
      return 100 * (1 - state.time / state.guessTime);
    }

    function color(): string {
      const _percentage = percentage();
      if (_percentage > 75) {
        return 'error';
      }

      if (_percentage > 50) {
        return 'warning';
      }

      return 'success';
    }

    onUnmounted(() => {
      socket.off(SHARED_EVENTS.GAME_START_LOAD);
      socket.off(SHARED_EVENTS.GAME_START_COUNTDOWN);
      socket.off(SHARED_EVENTS.GAME_SHOW_GUESS);
      socket.off(SHARED_EVENTS.STOP_CLIENT_GAME);
      socket.off(SHARED_EVENTS.GAME_NEW_ROUND);
    });

    return {
      ...toRefs(state),
      percentage,
      color
    };
  }
});
</script>
