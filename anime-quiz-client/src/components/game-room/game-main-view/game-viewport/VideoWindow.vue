<template>
  <v-col cols="12" sm="6">
    <v-row justify="center" no-gutters>
      <v-col cols="12" align-self="center" :style="styles()">
        <loading-circle></loading-circle>
        <countdown-timer></countdown-timer>
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

export default defineComponent({
  components: { CountdownTimer, LoadingCircle, NormalVideo },
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
