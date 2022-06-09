<template>
  <v-col cols="auto" v-show="src">
    <youtube
      @ready="ready($event)"
      player-width="320px"
      player-height="180px"
      :video-id="src"
      @ended="$emit('ended')"
      @playing="$emit('playing')"
      @paused="$emit('paused')"
      :player-vars="playerVars"
      host="https://www.youtube-nocookie.com"
    ></youtube>
  </v-col>
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
        modestbranding: 1,
        autoplay: 1
      }
    })

    let player: any

    watch(() => store.state.client.volume, (volume: number) => {
      changeVolume(volume)
    })

    watch(() => props.src, () => {
      context.emit('load', player.getDuration())
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
    }

    function pause(): void {
      player.pauseVideo()
    }

    function getCurrentTime(): number {
      return player.getCurrentTime()
    }

    function seek(duration: number): void {
      player.seekTo(duration, true)
    }

    function getMaxTime(): number {
      return player.getDuration()
    }

    return {
      ready,
      ...toRefs(state),
      getCurrentTime,
      play,
      pause,
      seek,
      getMaxTime
    }
  }
})
</script>
