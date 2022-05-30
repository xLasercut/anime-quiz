<template>
  <v-col cols="12" sm="6">
    <v-row justify="center" no-gutters>
      <v-col cols="12" align-self="center" :style="styles()">
        <loading-circle></loading-circle>
        <countdown-timer></countdown-timer>
        <youtube-video></youtube-video>
        <normal-video></normal-video>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import NormalVideo from './video-window/NormalVideo.vue'
import LoadingCircle from './video-window/LoadingCircle.vue'
import CountdownTimer from './video-window/CountdownTimer.vue'
import YoutubeVideo from './video-window/YoutubeVideo.vue'

export default defineComponent({
  components: { YoutubeVideo, CountdownTimer, LoadingCircle, NormalVideo },
  setup() {
    function styles() {
      return {
        ['text-align']: 'center'
      }
    }

    return {
      styles
    }
  }
})
</script>
