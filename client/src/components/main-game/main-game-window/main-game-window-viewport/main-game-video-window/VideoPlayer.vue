<template>
  <Player
    class="main-player"
    :currentTime="currentTime"
    :muted="muted"
    :volume="clientStore.volume"
    ref="player"
    :style="styles()"
    @vmDurationChange="updateDuration"
    @vmCurrentTimeChange="updateCurrentTime"
    @vmPlaybackReady="playbackReady = true"
    @vmSeeked="playerReady()"
  >
    <Video v-if="!isYoutube()">
      <source :data-src="gameStore.currentSong.src" />
    </Video>
    <Youtube :video-id="videoId()" v-if="isYoutube()"></Youtube>
  </Player>
</template>

<script setup lang="ts">
import { Player, Video, Youtube } from '@vime/vue-next';
import { useGameStore } from '@/plugins/store/game';
import { onUnmounted, ref } from 'vue';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { socket } from '@/plugins/socket';
import { useClientStore } from '@/plugins/store/client';

let loadingInterval: NodeJS.Timeout;

const player = ref<any>(null);
const muted = ref(false);
const show = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const playbackReady = ref(false);
const startPosition = ref(0);
const guessTime = ref(0);

const gameStore = useGameStore();
const clientStore = useClientStore();

function isYoutube() {
  return gameStore.currentSong.src.includes('youtube');
}

function videoId(): string {
  const currentSongSplit = gameStore.currentSong.src.split('v=');
  return currentSongSplit[1];
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

socket.on(SOCKET_EVENTS.GAME_NEW_ROUND, () => {
  show.value = false;
  playbackReady.value = false;
  duration.value = -1;
});

socket.on(SOCKET_EVENTS.GAME_START_LOAD, (_startPosition: number, _guessTime: number) => {
  startPosition.value = _startPosition;
  guessTime.value = _guessTime;
  load();
});

socket.on(SOCKET_EVENTS.GAME_START_COUNTDOWN, () => {
  console.log('starting countdown');
  clearInterval(loadingInterval);
  muted.value = false;
  player.value.play();
});

socket.on(SOCKET_EVENTS.GAME_SHOW_GUESS, () => {
  console.log('time is up');
  show.value = true;
});

socket.on(SOCKET_EVENTS.STOP_GAME, () => {
  clearInterval(loadingInterval);
  player.value.pause();
});

onUnmounted(() => {
  socket.off(SOCKET_EVENTS.GAME_NEW_ROUND);
  socket.off(SOCKET_EVENTS.GAME_START_LOAD);
  socket.off(SOCKET_EVENTS.GAME_START_COUNTDOWN);
  socket.off(SOCKET_EVENTS.GAME_SHOW_GUESS);
  socket.off(SOCKET_EVENTS.STOP_GAME);
  clearInterval(loadingInterval);
});
</script>
