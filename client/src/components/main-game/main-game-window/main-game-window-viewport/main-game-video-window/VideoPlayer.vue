<template>
  <Player
    :currentTime="currentTime"
    :muted="muted"
    :volume="volume"
    ref="player"
    :style="styles()"
    @vmDurationChange="updateDuration"
    @vmCurrentTimeChange="updateCurrentTime"
    @vmPlaybackReady="playbackReady = true"
    @vmSeeked="playerSeeked()"
  >
    <Video v-if="showNormal()">
      <source :data-src="gameStore.currentSong.src" />
    </Video>
    <Youtube :video-id="getVideoId(gameStore.currentSong.src)" v-if="showYoutube()"></Youtube>
  </Player>
</template>

<script setup lang="ts">
import { Player, Video, Youtube } from '@vime/vue-next';
import { useGameStore } from '@/plugins/store/game';
import { nextTick, onUnmounted, ref, watch } from 'vue';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { socket } from '@/plugins/socket';
import { useClientStore } from '@/plugins/store/client';
import { getVideoId, isYoutubeVideo } from '@/assets/game-helpers';

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

const notPauseAfterSeek = ref(false);

watch(
  () => clientStore.volume,
  (val: number) => {
    volume.value = val;
  }
);

watch([playbackReady, duration], async ([_playbackReady, _duration]) => {
  if (_playbackReady && _duration !== -1) {
    await seek();
  }
});

function showYoutube(): boolean {
  return isYoutubeVideo(gameStore.currentSong.src) && !disabled.value;
}

function showNormal(): boolean {
  return !isYoutubeVideo(gameStore.currentSong.src) && !disabled.value;
}

async function resetVolume(): Promise<void> {
  await nextTick(() => {
    if (clientStore.volume >= 100) {
      volume.value = clientStore.volume - 1;
    } else {
      volume.value = clientStore.volume + 1;
    }
  });
  await nextTick(() => {
    volume.value = clientStore.volume;
  });
}

async function playerSeekedBeforeCountdown() {
  await nextTick(() => {
    player.value.pause();
    muted.value = false;
  });
  await nextTick(() => {
    socket.emit(SOCKET_EVENTS.GAME_SONG_LOADED);
  });
  console.log('countdown not started, player ready to begin round');
}

async function playerSeekedAfterCountdown() {
  await resetVolume();
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

async function seek() {
  console.log('video loaded, updating starting position');
  await nextTick(() => {
    currentTime.value = getSeekPosition();
  });
  await nextTick(() => {
    player.value.play();
  });
}

socket.on(SOCKET_EVENTS.GAME_NEW_ROUND, () => {
  console.log('new game round');
  muted.value = true;
  disabled.value = true;
  show.value = false;
  playbackReady.value = false;
  duration.value = -1;
  notPauseAfterSeek.value = false;
});

socket.on(SOCKET_EVENTS.GAME_START_LOAD, async (_startPosition: number, _guessTime: number) => {
  console.log('loading video');
  muted.value = true;
  disabled.value = false;
  startPosition.value = _startPosition;
  guessTime.value = _guessTime;
  notPauseAfterSeek.value = false;
  await nextTick(() => {
    player.value.pause();
  });
});

socket.on(SOCKET_EVENTS.GAME_START_COUNTDOWN, async () => {
  console.log('starting countdown');
  disabled.value = false;
  muted.value = false;
  notPauseAfterSeek.value = true;
  await resetVolume();
  await nextTick(() => {
    player.value.play();
  });
});

socket.on(SOCKET_EVENTS.GAME_SHOW_GUESS, () => {
  console.log('time is up');
  show.value = true;
  disabled.value = false;
  muted.value = false;
  notPauseAfterSeek.value = true;
});

socket.on(SOCKET_EVENTS.STOP_GAME, () => {
  player.value.pause();
  disabled.value = false;
  notPauseAfterSeek.value = false;
});

onUnmounted(() => {
  socket.off(SOCKET_EVENTS.GAME_NEW_ROUND);
  socket.off(SOCKET_EVENTS.GAME_START_LOAD);
  socket.off(SOCKET_EVENTS.GAME_START_COUNTDOWN);
  socket.off(SOCKET_EVENTS.GAME_SHOW_GUESS);
  socket.off(SOCKET_EVENTS.STOP_GAME);
});
</script>
