<template>
  <Player class="main-player" :autopause="false" :volume="100" ref="player" @vmPlaybackReady="playVideo()">
    <Video v-if="!isYoutube()">
      <source :data-src="gameStore.currentSong.src" />
    </Video>
    <Youtube :video-id="videoId()" v-if="isYoutube()"></Youtube>
  </Player>
</template>

<script setup lang="ts">
import { Player, Youtube, Video } from '@vime/vue-next';
import { useGameStore } from '@/plugins/store/game';
import { ref } from 'vue';

const player = ref<any>(null);

const gameStore = useGameStore();

function isYoutube() {
  return gameStore.currentSong.src.includes('youtube');
}

function videoId(): string {
  const currentSongSplit = gameStore.currentSong.src.split('v=');
  return currentSongSplit[1];
}

function playVideo(): void {
  player.value.play();
}
</script>
