<template>
  <video
    ref="player"
    :src="$store.state.game.currentSong.src"
    @loadedmetadata="metaDataLoaded()"
    @canplaythrough="fullLoaded()"
    preload="none"
    :hidden="!show"
  ></video>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, reactive, ref, toRefs } from '@vue/composition-api'
import { SHARED_EVENTS } from '../../../../../assets/shared/events'
import { socket } from '../../../../../plugins/socket'
import { calculateStartPosition } from '../../../../../assets/game-helper'

export default defineComponent({
  setup() {
    const player = ref<HTMLVideoElement>()

    const state = reactive({
      show: false,
      startPosition: 0,
      guessTime: 0
    })

    socket.on(SHARED_EVENTS.GAME_START_LOAD, (startPosition: number, guessTime: number) => {
      state.show = false
      state.guessTime = guessTime
      state.startPosition = startPosition
      if (player.value) {
        player.value.pause()
        player.value.load()
      }
    })

    socket.on(SHARED_EVENTS.GAME_START_COUNTDOWN, () => {
      if (player.value) {
        player.value.play()
      }
    })

    socket.on(SHARED_EVENTS.GAME_SHOW_GUESS, () => {
      state.show = true
    })

    socket.on(SHARED_EVENTS.STOP_CLIENT_GAME, () => {
      if (player.value) {
        player.value.pause()
      }
    })

    function metaDataLoaded(): void {
      if (player.value) {
        player.value.currentTime = calculateStartPosition(state.startPosition, state.guessTime, player.value.duration)
      }
    }

    function fullLoaded(): void {
      console.log('Song Loaded')
      socket.emit(SHARED_EVENTS.GAME_SONG_LOADED)
    }

    onUnmounted(() => {
      socket.off(SHARED_EVENTS.GAME_START_LOAD)
      socket.off(SHARED_EVENTS.GAME_START_COUNTDOWN)
      socket.off(SHARED_EVENTS.GAME_SHOW_GUESS)
    })

    return {
      ...toRefs(state),
      player,
      metaDataLoaded,
      fullLoaded
    }
  }
})
</script>

<style scoped>
video {
  max-width: 100%;
  max-height: 180px;
  margin: 0;
  padding: 0;
}
</style>
