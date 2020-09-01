<template>
  <v-col cols="12" sm="6">
    <v-row justify="center" no-gutters>
      <v-col class="game-display-container">
        <amq-countdown-timer></amq-countdown-timer>
        <amq-normal-video :volume="volume"></amq-normal-video>
        <amq-youtube-video :volume="volume"></amq-youtube-video>
        <amq-loading-circle></amq-loading-circle>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from '@vue/composition-api'
import AmqYoutubeVideo from '@/amq-game/amq-game-window/amq-viewport/amq-video-window/AmqYoutubeVideo.vue'
import AmqNormalVideo from '@/amq-game/amq-game-window/amq-viewport/amq-video-window/AmqNormalVideo.vue'
import AmqCountdownTimer from '@/amq-game/amq-game-window/amq-viewport/amq-video-window/AmqCountdownTimer.vue'
import AmqLoadingCircle from '@/amq-game/amq-game-window/amq-viewport/amq-video-window/AmqLoadingCircle.vue'
import {EventBus} from '@/assets/event'

export default defineComponent({
  components: {
    AmqNormalVideo, AmqYoutubeVideo, AmqCountdownTimer, AmqLoadingCircle
  },
  setup(_props, _context) {
    const state = reactive({
      volume: 50
    })

    EventBus.$on('CHANGE_AMQ_VOLUME', (volume: number) => {
      state.volume = volume
    })

    return {...toRefs(state)}
  }
})
</script>

