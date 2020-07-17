<template>
  <youtube
    @ready="ready($event)" :class="videoClasses()" :player-vars="playerVars" :video-id="videoId()"
    player-width="100%" player-height="100%"
  ></youtube>
</template>

<script lang="ts">
  import {defineComponent, onMounted, reactive, toRefs} from '@vue/composition-api'
  import {socket} from '@/assets/socket'
  import { getIdFromURL } from 'vue-youtube-embed'

  export default defineComponent({
    setup(_props, context) {
      const state = reactive({
        show: false,
        playerVars: {
          fs: 0,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          playsinline: 1
        },
        timeout: null,
        loading: false
      })

      let player: any = null

      let timeout: any = null

      function isYoutubeVideo(): boolean {
        return context.root.$store.getters.isAmqVideoType('youtube')
      }

      function videoClasses(): string {
        let classes = ['youtube-video']
        if (!state.show) {
          classes.push('video-hidden')
        }

        return classes.join(' ')
      }

      function ready(event: any): void {
        player = event.target
      }

      function pause(): void {
        if (player) {
          player.pauseVideo()
        }
      }

      function load(): void {
        timeout = setInterval(() => {
          startLoad()
          if (player.getDuration() != 0) {
            endLoad()
            socket.emit('AMQ_SONG_LOADED')
          }
        }, 500)
      }

      function startLoad(): void {
        if (!state.loading) {
          player.mute()
          player.playVideo()
          state.loading = true
        }
      }

      function endLoad(): void {
        player.seekTo(context.root.$store.getters.amqStartPosition(player.getDuration()), true)
        pause()
        player.unMute()
        state.loading = false
        clearInterval(timeout)
      }

      function videoId(): string {
        return getIdFromURL(context.root.$store.state.amq.gameState.currentSong.src)
      }

      onMounted(() => {
        socket.on('AMQ_START_LOAD', (): void => {
          state.show = false
          pause()
          if (isYoutubeVideo()) {
            load()
          }
        })

        socket.on('AMQ_START_COUNTDOWN', (): void => {
          if (isYoutubeVideo()) {
            endLoad()
            player.playVideo()
          }
        })

        socket.on('AMQ_TIME_UP', (): void => {
          if (isYoutubeVideo()) {
            state.show = true
          }
        })

        socket.on('AMQ_RESET', (): void => {
          endLoad()
        })
      })

      return {ready, videoClasses, ...toRefs(state), videoId}
    }
  })
</script>

<style scoped>
  .youtube-video {
    height: 100%;
  }

  .video-hidden {
    position: absolute;
    top: -200%;
  }
</style>
