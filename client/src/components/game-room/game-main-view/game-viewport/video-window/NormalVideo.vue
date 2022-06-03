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
import { defineComponent, inject, onMounted, onUnmounted, reactive, ref, toRefs } from '@vue/composition-api'
import { SHARED_EVENTS } from '../../../../../assets/shared/events'
import { socket } from '../../../../../plugins/socket'
import { calculateStartPosition, getDefaultVolume } from '../../../../../assets/game-helper'
import { store } from '../../../../../plugins/store'
import { CLIENT_EVENTS } from '../../../../../assets/events'

export default defineComponent({
  setup() {
    const player = ref<HTMLVideoElement>()

    const state = reactive({
      show: false,
      startPosition: 0,
      guessTime: 0
    })

    const registerChangeVolume = inject<Function>(CLIENT_EVENTS.REGISTER_CHANGE_VOLUME_NORMAL_VIDEO)
    if (registerChangeVolume) {
      registerChangeVolume(changeVolume)
    }

    function changeVolume(volume: number): void {
      if (player.value) {
        player.value.volume = volume / 100
      }
    }

    socket.on(SHARED_EVENTS.GAME_NEW_ROUND, () => {
      state.show = false
    })

    socket.on(SHARED_EVENTS.GAME_START_LOAD, (startPosition: number, guessTime: number) => {
      pause()
      state.show = false
      state.guessTime = guessTime
      state.startPosition = startPosition
      if (!store.getters.isYoutubeVideo) {
        load()
      }
    })

    socket.on(SHARED_EVENTS.GAME_START_COUNTDOWN, () => {
      if (!store.getters.isYoutubeVideo) {
        play()
      }
    })

    socket.on(SHARED_EVENTS.GAME_SHOW_GUESS, () => {
      if (!store.getters.isYoutubeVideo) {
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
      if (player.value && !store.getters.isYoutubeVideo) {
        player.value.currentTime = calculateStartPosition(state.startPosition, state.guessTime, player.value.duration)
      }
    }

    function fullLoaded(): void {
      if (!store.getters.isYoutubeVideo) {
        console.log('Song Loaded')
        socket.emit(SHARED_EVENTS.GAME_SONG_LOADED)
      }
    }

    function videoSrc(): string {
      if (!store.getters.isYoutubeVideo) {
        return store.state.game.currentSong.src
      }

      return ''
    }

    onMounted(() => {
      changeVolume(getDefaultVolume())
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
