<template>
  <video
    ref="player"
    @loadedmetadata="metadataLoaded()"
    @loadeddata="songLoaded()"
    :class="videoClasses()"
    @seeked="songSeeked()"
    :muted="muted"
    :src="$store.state.amq.gameState.currentSong.src"
    type="video/webm"
  >
    Your browser does not support video element
  </video>
</template>

<script lang="ts">
import {defineComponent, onUnmounted, reactive, ref, toRefs, watch} from '@vue/composition-api'
import {socket} from '@/assets/socket'

export default defineComponent({
  props: {
    volume: {
      required: true
    }
  },
  setup(props, context) {
    const player: any = ref(null)

    const state = reactive({
      show: false,
      muted: false,
      alreadyPlaying: false
    })

    function songLoaded(): void {
      console.log('song loaded')
      // player.value.currentTime = context.root.$store.getters.amqStartPosition(player.value.duration)
      // state.muted = true
      // player.value.play()
    }

    function metadataLoaded(): void {
      console.log('song metadata loaded')
      player.value.currentTime = context.root.$store.getters.amqStartPosition(player.value.duration)
      state.muted = true
      player.value.play()
    }

    function songSeeked(): void {
      console.log('song seeked')
      if (!state.alreadyPlaying) {
        player.value.pause()
      }
      state.muted = false
      socket.emit('AMQ_SONG_LOADED')
    }

    function isNormalVideo(): boolean {
      return context.root.$store.getters.isAmqVideoType('normal')
    }

    function videoClasses(): string {
      if (state.show) {
        return ''
      }
      return 'video-hidden'
    }

    watch(() => props.volume, (val: any) => {
      if (player && player.value) {
        player.value.volume = val / 100
      }
    })

    socket.on('AMQ_START_LOAD', (): void => {
      state.alreadyPlaying = false
      state.show = false
      player.value.pause()
      if (isNormalVideo()) {
        player.value.load()
      }
    })

    socket.on('AMQ_START_COUNTDOWN', (): void => {
      if (isNormalVideo()) {
        state.alreadyPlaying = true
        state.muted = false
        player.value.play()
      }
    })

    socket.on('AMQ_TIME_UP', (): void => {
      if (isNormalVideo()) {
        state.show = true
      }
    })

    socket.on('AMQ_RESET', (): void => {
      player.value.pause()
    })


    onUnmounted(() => {
      socket.off('AMQ_START_LOAD')
      socket.off('AMQ_START_COUNTDOWN')
      socket.off('AMQ_TIME_UP')
      socket.off('AMQ_RESET')
    })

    return {player, songLoaded, ...toRefs(state), videoClasses, songSeeked, metadataLoaded}
  }
})
</script>

<style scoped>
video {
  max-height: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
}

.video-hidden {
  position: absolute;
  top: -200%;
}
</style>
