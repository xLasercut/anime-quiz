<template>
  <youtube
    @ready="ready($event)"
    player-width="320px"
    player-height="180px"
    :video-id="src"
    @ended="$emit('ended')"
    :player-vars="playerVars"
    host="https://www.youtube-nocookie.com"
    v-show="src"
  ></youtube>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import { store } from '../../plugins/store'

export default defineComponent({
  props: {
    src: {
      required: true,
      type: String
    }
  },
  setup(props, context) {
    const state = reactive({
      playerVars: {
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1
      }
    })

    let player: any
    let timeout: any

    watch(() => store.state.client.volume, (volume: number) => {
      changeVolume(volume)
    })

    function changeVolume(volume: number): void {
      player.setVolume(volume)
    }

    function ready(event: any): void {
      player = event.target
      changeVolume(store.state.client.volume)
    }

    function play(): void {
      player.playVideo()
      timeout = setInterval(() => {
        if (player.getDuration() !== 0) {
          onLoaded()
        }
      }, 500)
    }

    function pause(): void {
      player.pauseVideo()
    }

    function onLoaded(): void {
      clearInterval(timeout)
      context.emit('load', player.getDuration())
    }

    function getCurrentTime(): number {
      return player.getCurrentTime()
    }

    function seek(duration: number): void {
      player.seekTo(duration, true)
    }

    return {
      ready,
      ...toRefs(state),
      getCurrentTime,
      play,
      pause,
      seek
    }
  }
})
</script>
