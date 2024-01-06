<template>
  <Player
    class="main-player"
    :currentTime="currentTime"
    :muted="muted"
    :volume="volume"
    ref="player"
    :style="styles()"
    @vmDurationChange="updateDuration"
    @vmCurrentTimeChange="updateCurrentTime"
    @vmPlaybackReady="playbackReady = true"
    @vmSeeked="playerReady()"
  >
    <Video v-if="!isYoutube() && !disabled">
      <source :data-src="gameStore.currentSong.src" />
    </Video>
    <Youtube :video-id="videoId()" v-if="isYoutube() && !disabled"></Youtube>
  </Player>
</template>

<script setup lang="ts">
import { Player, Video, Youtube } from '@vime/vue-next';
import { useGameStore } from '@/plugins/store/game';
import { nextTick, onUnmounted, ref, watch } from 'vue';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { socket } from '@/plugins/socket';
import { useClientStore } from '@/plugins/store/client';

let loadingInterval: NodeJS.Timeout;
let timeout: NodeJS.Timeout;

const gameStore = useGameStore();
const clientStore = useClientStore();

const player = ref<any>(null);
const muted = ref(false);
const show = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const playbackReady = ref(false);
const startPosition = ref(0);
const guessTime = ref(0);
const disabled = ref(false);
const volume = ref(clientStore.volume);

watch(
  () => clientStore.volume,
  (val: number) => {
    volume.value = val;
  }
);

function isYoutube() {
  return gameStore.currentSong.src.includes('youtube');
}

function videoId(): string {
  const currentSongSplit = gameStore.currentSong.src.split('v=');
  return currentSongSplit[1];
}

function resetVolume(): void {
  if (clientStore.volume === 0) {
    volume.value = 1;
  } else {
    volume.value = 0;
  }
  nextTick(() => {
    volume.value = clientStore.volume;
  });
}

function playerReady(): void {
  player.value.pause();
  muted.value = false;
  socket.emit(SOCKET_EVENTS.GAME_SONG_LOADED);
  console.log('starting position updated');
}

function updateDuration(val: any) {
  duration.value = val;
}

function updateCurrentTime(val: any) {
  currentTime.value = val;
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

function load() {
  muted.value = true;
  player.value.pause();
  loadingInterval = setInterval(() => {
    console.log('loading video...');
    if (playbackReady.value && duration.value !== -1) {
      console.log('video loaded, updating starting position...');
      currentTime.value = getSeekPosition();
      player.value.play();
      clearInterval(loadingInterval);
    }
  }, 500);
}

function clearTimers() {
  clearInterval(loadingInterval);
  clearTimeout(timeout);
}

socket.on(SOCKET_EVENTS.GAME_NEW_ROUND, () => {
  clearTimers();
  disabled.value = true;
  show.value = false;
  playbackReady.value = false;
  duration.value = -1;
  timeout = setTimeout(() => {
    disabled.value = false;
  }, 500);
});

socket.on(SOCKET_EVENTS.GAME_START_LOAD, (_startPosition: number, _guessTime: number) => {
  clearTimers();
  disabled.value = false;
  startPosition.value = _startPosition;
  guessTime.value = _guessTime;
  load();
  resetVolume();
});

socket.on(SOCKET_EVENTS.GAME_START_COUNTDOWN, () => {
  console.log('starting countdown');
  clearTimers();
  disabled.value = false;
  muted.value = false;
  nextTick(() => {
    player.value.play();
  });
});

socket.on(SOCKET_EVENTS.GAME_SHOW_GUESS, () => {
  console.log('time is up');
  clearTimers();
  show.value = true;
  disabled.value = false;
});

socket.on(SOCKET_EVENTS.STOP_GAME, () => {
  clearTimers();
  player.value.pause();
  disabled.value = false;
});

onUnmounted(() => {
  clearTimers();
  socket.off(SOCKET_EVENTS.GAME_NEW_ROUND);
  socket.off(SOCKET_EVENTS.GAME_START_LOAD);
  socket.off(SOCKET_EVENTS.GAME_START_COUNTDOWN);
  socket.off(SOCKET_EVENTS.GAME_SHOW_GUESS);
  socket.off(SOCKET_EVENTS.STOP_GAME);
});
</script>
