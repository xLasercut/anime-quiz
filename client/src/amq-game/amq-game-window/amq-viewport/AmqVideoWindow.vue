<template>
  <v-col cols="12" sm="6">
    <v-row justify="center" no-gutters>
      <v-col class="video-container">
        <amq-countdown-timer></amq-countdown-timer>
        <amq-normal-video></amq-normal-video>
        <amq-youtube-video></amq-youtube-video>
        <amq-loading-circle></amq-loading-circle>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import AmqYoutubeVideo from '@/amq-game/amq-game-window/amq-viewport/amq-video-window/AmqYoutubeVideo.vue'
import AmqNormalVideo from '@/amq-game/amq-game-window/amq-viewport/amq-video-window/AmqNormalVideo.vue'
import AmqCountdownTimer from '@/amq-game/amq-game-window/amq-viewport/amq-video-window/AmqCountdownTimer.vue'
import AmqLoadingCircle from '@/amq-game/amq-game-window/amq-viewport/amq-video-window/AmqLoadingCircle.vue'

export default defineComponent({
  components: {
    AmqNormalVideo, AmqYoutubeVideo, AmqCountdownTimer, AmqLoadingCircle
  }
})
</script>

<style scoped>
.video-container {
  height: 200px;
  text-align: center;
  padding: 10px;
  max-width: 352px;
}
</style>
