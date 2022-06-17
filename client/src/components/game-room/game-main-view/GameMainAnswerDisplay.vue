<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-row no-gutters justify="center">
        <v-col cols="5" sm="3" md="2">
          <v-sheet class="count-container">
            {{ $store.state.game.currentSongCount }} / {{ $store.state.game.maxSongCount }}
          </v-sheet>
        </v-col>
      </v-row>
      <v-row no-gutters justify="center">
        <v-col cols="12" sm="8" md="6" lg="5">
          <component :is="component()"></component>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, reactive, toRefs } from '@vue/composition-api';
import { SHARED_EVENTS } from '../../../assets/shared/events';
import { socket } from '../../../plugins/socket';
import MainAnswerAnswerDisplay from './game-main-answer-display/MainAnswerAnswerDisplay.vue';
import MainAnswerQuestionDisplay from './game-main-answer-display/MainAnswerQuestionDisplay.vue';

export default defineComponent({
  setup() {
    const state = reactive({
      show: false
    });

    socket.on(SHARED_EVENTS.GAME_NEW_ROUND, () => {
      state.show = false;
    });

    socket.on(SHARED_EVENTS.GAME_SHOW_GUESS, () => {
      state.show = true;
    });

    onUnmounted(() => {
      socket.off(SHARED_EVENTS.GAME_NEW_ROUND);
      socket.off(SHARED_EVENTS.GAME_SHOW_GUESS);
    });

    function component() {
      if (state.show) {
        return MainAnswerAnswerDisplay;
      }
      return MainAnswerQuestionDisplay;
    }

    return {
      ...toRefs(state),
      component
    };
  }
});
</script>

<style scoped>
.count-container {
  border-radius: 20px 20px 0 0;
  text-align: center;
}
</style>
