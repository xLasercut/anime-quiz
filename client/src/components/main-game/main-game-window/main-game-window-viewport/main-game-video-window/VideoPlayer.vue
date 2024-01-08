<template>
  <media-player
    class="game-video-player"
    ref="player"
    :muted="muted"
    :src="gameStore.currentSong.src"
    :currentTime="currentTime"
    :volume="clientStore.volume / 100"
    @time-update="updateCurrentTime($event)"
    @duration-change="updateDuration($event)"
    @can-play="playbackReady = true"
    @seeked="playerSeeked()"
    :style="styles()"
  >
    <media-provider></media-provider>
  </media-player>
</template>

<script setup lang="ts">
import { useGameStore } from '@/plugins/store/game';
import { nextTick, onUnmounted, ref, watch } from 'vue';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { socket } from '@/plugins/socket';
import { useClientStore } from '@/plugins/store/client';
import { MediaDurationChangeEvent, MediaTimeUpdateEvent } from 'vidstack';

let timer: NodeJS.Timeout;

const gameStore = useGameStore();
const clientStore = useClientStore();

const emit = defineEmits(['update:loading-color']);

const player = ref<any>(null);
const muted = ref(false);
const show = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const playbackReady = ref(false);
const startPosition = ref(0);
const guessTime = ref(0);

const notPauseAfterSeek = ref(false);

async function playerSeekedBeforeCountdown() {
  await nextTick(() => {
    player.value.pause();
    muted.value = false;
  });
  await nextTick(() => {
    socket.emit(SOCKET_EVENTS.GAME_SONG_LOADED);
    emit('update:loading-color', 'success');
  });
  console.log('countdown not started, player ready to begin round');
}

async function playerSeekedAfterCountdown() {
  await nextTick(() => {
    muted.value = false;
  });
  console.log('countdown already started, video will continue to play');
}

async function playerSeeked(): Promise<void> {
  console.log('starting position updated');
  if (notPauseAfterSeek.value) {
    await playerSeekedAfterCountdown();
    return;
  }

  await playerSeekedBeforeCountdown();
}

function updateCurrentTime(event: MediaTimeUpdateEvent) {
  currentTime.value = event.detail.currentTime;
}

function updateDuration(event: MediaDurationChangeEvent) {
  duration.value = event.detail;
}

function styles() {
  if (show.value) {
    return {
      opacity: '1'
    };
  }
  return {
    opacity: '0'
  };
}

function getSeekPosition(): number {
  const maxStart = Math.floor(duration.value - guessTime.value);
  if (maxStart > 0) {
    return Math.floor(startPosition.value * maxStart);
  }
  return 0;
}

function startSeek() {
  console.log('video loaded, updating starting position');
  player.value.play();
  currentTime.value = getSeekPosition();
}

function startLoad() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (playbackReady.value && duration.value !== -1) {
      startSeek();
      clearInterval(timer);
    }
  }, 500);
}

socket.on(SOCKET_EVENTS.GAME_NEW_ROUND, () => {
  console.log('new game round');
  clearInterval(timer);
  muted.value = true;
  show.value = false;
  playbackReady.value = false;
  duration.value = -1;
  notPauseAfterSeek.value = false;
});

socket.on(SOCKET_EVENTS.GAME_START_LOAD, async (_startPosition: number, _guessTime: number) => {
  console.log('loading video');
  clearInterval(timer);
  muted.value = true;
  startPosition.value = _startPosition;
  guessTime.value = _guessTime;
  notPauseAfterSeek.value = false;
  startLoad();
});

socket.on(SOCKET_EVENTS.GAME_START_COUNTDOWN, async () => {
  console.log('starting countdown');
  muted.value = false;
  notPauseAfterSeek.value = true;
  player.value.play();
});

socket.on(SOCKET_EVENTS.GAME_SHOW_GUESS, () => {
  console.log('time is up');
  show.value = true;
  muted.value = false;
  notPauseAfterSeek.value = true;
});

socket.on(SOCKET_EVENTS.STOP_GAME, () => {
  clearInterval(timer);
  player.value.pause();
  notPauseAfterSeek.value = false;
});

onUnmounted(() => {
  clearInterval(timer);
  socket.off(SOCKET_EVENTS.GAME_NEW_ROUND);
  socket.off(SOCKET_EVENTS.GAME_START_LOAD);
  socket.off(SOCKET_EVENTS.GAME_START_COUNTDOWN);
  socket.off(SOCKET_EVENTS.GAME_SHOW_GUESS);
  socket.off(SOCKET_EVENTS.STOP_GAME);
});
</script>

<style scoped>
.game-video-player {
  height: 100%;
  width: 100%;
  border-radius: 4px;
  border: none;
}
</style>
