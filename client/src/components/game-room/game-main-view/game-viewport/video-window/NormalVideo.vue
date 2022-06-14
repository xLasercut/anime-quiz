<template>
  <video
    ref="player"
    :src="videoSrc()"
    @loadedmetadata="metaDataLoaded()"
    @canplaythrough="fullLoaded()"
    preload="none"
    :hidden="!show"
  ></video>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
  watch
} from '@vue/composition-api'
import { SHARED_EVENTS } from '../../../../../assets/shared/events'
import { socket } from '../../../../../plugins/socket'
import { calculateStartPosition, isYoutubeVideo } from '../../../../../assets/game-helper'
import { store } from '../../../../../plugins/store'

export default defineComponent({
  setup() {
    const player = ref<HTMLVideoElement>()

    const state = reactive({
      show: false,
      startPosition: 0,
      guessTime: 0
    })

    watch(
      () => store.state.client.volume,
      (val: number) => {
        changeVolume(val)
      }
    )

    function changeVolume(volume: number): void {
      if (player.value) {
        player.value.volume = volume / 100
      }
    }

    function _isNormalVideo(): boolean {
      return !isYoutubeVideo(store.state.game.currentSong.src)
    }

    socket.on(SHARED_EVENTS.GAME_NEW_ROUND, () => {
      state.show = false
    })

    socket.on(SHARED_EVENTS.GAME_START_LOAD, (startPosition: number, guessTime: number) => {
      pause()
      state.show = false
      state.guessTime = guessTime
      state.startPosition = startPosition
      if (_isNormalVideo()) {
        load()
      }
    })

    socket.on(SHARED_EVENTS.GAME_START_COUNTDOWN, () => {
      if (_isNormalVideo()) {
        play()
      }
    })

    socket.on(SHARED_EVENTS.GAME_SHOW_GUESS, () => {
      if (_isNormalVideo()) {
        state.show = true
      }
    })

    socket.on(SHARED_EVENTS.STOP_CLIENT_GAME, () => {
      pause()
    })

    function load(): void {
      if (player.value) {
        player.value.load()
      }
    }

    function pause(): void {
      if (player.value) {
        player.value.pause()
      }
    }

    function play(): void {
      if (player.value) {
        player.value.play()
      }
    }

    function metaDataLoaded(): void {
      if (player.value && _isNormalVideo()) {
        player.value.currentTime = calculateStartPosition(
          state.startPosition,
          state.guessTime,
          player.value.duration
        )
      }
    }

    function fullLoaded(): void {
      if (_isNormalVideo()) {
        console.log('Song Loaded')
        socket.emit(SHARED_EVENTS.GAME_SONG_LOADED)
      }
    }

    function videoSrc(): string {
      if (_isNormalVideo()) {
        return store.state.game.currentSong.src
      }

      return ''
    }

    onMounted(() => {
      changeVolume(store.state.client.volume)
    })

    onUnmounted(() => {
      socket.off(SHARED_EVENTS.GAME_START_LOAD)
      socket.off(SHARED_EVENTS.GAME_START_COUNTDOWN)
      socket.off(SHARED_EVENTS.GAME_SHOW_GUESS)
      socket.off(SHARED_EVENTS.STOP_CLIENT_GAME)
      socket.off(SHARED_EVENTS.GAME_NEW_ROUND)
    })

    return {
      ...toRefs(state),
      player,
      metaDataLoaded,
      fullLoaded,
      videoSrc
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
