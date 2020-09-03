<template>
  <v-row>
    <v-col cols="12" sm="3"></v-col>
    <aiq-image-window></aiq-image-window>
    <aiq-countdown-timer></aiq-countdown-timer>
    <aiq-image-info></aiq-image-info>
  </v-row>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import AiqImageWindow from '@/aiq-game/aiq-game-window/aiq-viewport/AiqImageWindow.vue'
import AiqCountdownTimer from '@/aiq-game/aiq-game-window/aiq-viewport/AiqCountdownTimer.vue'
import AiqImageInfo from '@/aiq-game/aiq-game-window/aiq-viewport/AiqImageInfo.vue'


export default defineComponent({
  components: {
    AiqImageWindow, AiqCountdownTimer, AiqImageInfo
  }
})
</script>
