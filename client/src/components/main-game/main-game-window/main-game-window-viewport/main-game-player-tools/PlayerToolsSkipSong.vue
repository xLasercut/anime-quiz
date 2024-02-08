<template>
  <v-row :dense="true">
    <v-col>
      <icon-btn :icon="skipButtonIcon" :color="skipButtonColor" :disabled="disabled || !gameStore.playing" @click="voteSkip()">
        {{ skipButtonText }}
      </icon-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useGameStore } from '@/plugins/store/game';
import { onUnmounted, ref } from 'vue';
import IconBtn from '@/components/common/buttons/IconBtn.vue';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';

const gameStore = useGameStore();
const disabled = ref(true);
const skipButtonColor = ref('warning');
const skipButtonText = ref('Vote to skip');
const skipButtonIcon = ref('mdi-skip-forward');

function voteSkip() {
  disabled.value = true;
  socket.emit(SOCKET_EVENTS.GAME_SKIP_SONG, (success: boolean) => {
    if (success) {
      skipButtonColor.value = 'success';
      skipButtonText.value = 'Voted';
      skipButtonIcon.value = 'mdi-check';
      return;
    }

    disabled.value = false;
  });
}

function resetVoteToSkipButton() {
  disabled.value = true;
  skipButtonText.value = 'Vote to skip';
  skipButtonColor.value = 'warning';
  skipButtonIcon.value = 'mdi-skip-forward';
}

socket.on(SOCKET_EVENTS.GAME_NEW_ROUND, () => {
  resetVoteToSkipButton();
});

socket.on(SOCKET_EVENTS.GAME_START_COUNTDOWN, () => {
  disabled.value = false;
});

socket.on(SOCKET_EVENTS.GAME_SHOW_GUESS, () => {
  resetVoteToSkipButton();
});

socket.on(SOCKET_EVENTS.STOP_GAME, () => {
  resetVoteToSkipButton();
});

onUnmounted(() => {
  socket.off(SOCKET_EVENTS.GAME_NEW_ROUND);
  socket.off(SOCKET_EVENTS.GAME_START_COUNTDOWN);
  socket.off(SOCKET_EVENTS.GAME_SHOW_GUESS);
  socket.off(SOCKET_EVENTS.STOP_GAME);
});
</script>
