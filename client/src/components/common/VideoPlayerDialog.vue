<template>
  <v-col cols="auto">
    <media-player
      autoplay
      :src="clientStore.mediaPreviewSrc"
      :volume="clientStore.volume / 100"
      load="eager"
      @volume-change="onVolumeChange"
    >
      <media-provider></media-provider>
      <media-audio-layout></media-audio-layout>
      <media-video-layout></media-video-layout>
    </media-player>
  </v-col>
</template>

<script setup lang="ts">
import { useClientStore } from '@/plugins/store/client';
import { MediaVolumeChangeEvent } from 'vidstack';

const clientStore = useClientStore();

function onVolumeChange(e: MediaVolumeChangeEvent) {
  clientStore.updateVolume(e.detail.volume * 100);
}
</script>
