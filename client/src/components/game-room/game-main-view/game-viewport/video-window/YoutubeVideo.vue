<template>
  <v-row no-gutters justify="center" v-show="show">
    <youtube
      @ready="ready($event)"
      player-width="100%"
      player-height="180px"
      :video-id="videoSrc()"
      :player-vars="playerVars"
      host="https://www.youtube-nocookie.com"
      class="youtube-video"
    ></youtube>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, reactive, toRefs, watch } from '@vue/composition-api'
import { socket } from '../../../../../plugins/socket'
import { SHARED_EVENTS } from '../../../../../assets/shared/events'
import { store } from '../../../../../plugins/store'
import { getIdFromURL } from 'vue-youtube-embed'
import { calculateStartPosition, isYoutubeVideo } from '../../../../../assets/game-helper'

export default defineComponent({
  setup() {
    const state = reactive({
      show: false,
      playerVars: {
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1
      },
      guessTime: 0,
      startPosition: 0
    })

    let player: any

    let timeout: number

    watch(() => store.state.client.volume, (val: number) => {
      changeVolume(val)
    })

    function changeVolume(volume: number): void {
      player.setVolume(volume)
    }

    function ready(event: any): void {
      player = event.target
      changeVolume(store.state.client.volume)
    }

    function load(): void {
      player.mute()
      timeout = setInterval(() => {
        if (player.getDuration() !== 0) {
          fullLoaded()
        }
      }, 500)
    }

    function fullLoaded(): void {
      clearInterval(timeout)
      player.seekTo(calculateStartPosition(state.startPosition, state.guessTime, player.getDuration()), true)
      player.pauseVideo()
      player.unMute()
      console.log('Song loaded')
      socket.emit(SHARED_EVENTS.GAME_SONG_LOADED)
    }

    function _isYoutubeVideo(): boolean {
      return isYoutubeVideo(store.state.game.currentSong.src)
    }

    socket.on(SHARED_EVENTS.GAME_NEW_ROUND, () => {
      state.show = false
    })

    socket.on(SHARED_EVENTS.GAME_START_LOAD, (startPosition: number, guessTime: number) => {
      player.pauseVideo()
      state.show = false
      state.guessTime = guessTime
      state.startPosition = startPosition
      if (_isYoutubeVideo()) {
        load()
      }
    })

    socket.on(SHARED_EVENTS.GAME_START_COUNTDOWN, () => {
      if (_isYoutubeVideo()) {
        player.unMute()
        player.playVideo()
      }
    })

    socket.on(SHARED_EVENTS.GAME_SHOW_GUESS, () => {
      if (_isYoutubeVideo()) {
        state.show = true
      }
    })

    socket.on(SHARED_EVENTS.STOP_CLIENT_GAME, () => {
      player.pauseVideo()
    })

    onUnmounted(() => {
      socket.off(SHARED_EVENTS.GAME_START_LOAD)
      socket.off(SHARED_EVENTS.GAME_START_COUNTDOWN)
      socket.off(SHARED_EVENTS.GAME_SHOW_GUESS)
      socket.off(SHARED_EVENTS.STOP_CLIENT_GAME)
      socket.off(SHARED_EVENTS.GAME_NEW_ROUND)
    })

    function videoSrc(): string {
      if (_isYoutubeVideo()) {
        return getIdFromURL(store.state.game.currentSong.src)
      }
      return ''
    }

    return {
      ...toRefs(state),
      ready,
      videoSrc
    }
  }
})
</script>

<style scoped>
.youtube-video {
  max-width: 320px;
  max-height: 180px;
}
</style>
