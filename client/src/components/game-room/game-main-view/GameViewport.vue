<template>
  <v-row>
    <v-col cols="12" sm="3"></v-col>
    <video-window></video-window>
    <current-song-info></current-song-info>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import CurrentSongInfo from './game-viewport/CurrentSongInfo.vue';
import VideoWindow from './game-viewport/VideoWindow.vue';

export default defineComponent({
  components: { VideoWindow, CurrentSongInfo }
});
</script>
