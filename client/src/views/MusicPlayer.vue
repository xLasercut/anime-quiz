<template>
  <v-main>
    <v-card flat>
      <v-card-text>
        <v-row justify="center" no-gutters>
          <music-player-youtube
            ref="youtube"
            @load="setMaxDuration($event)"
            @ended="ended()"
            :src="youtubeVideoSrc()"
          ></music-player-youtube>
          <music-player-normal
            ref="normal"
            @load="setMaxDuration($event)"
            @ended="ended()"
            :src="videoSrc()"
          ></music-player-normal>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <music-player-controls
        :current-time="currentTime"
        :max-time="maxTime"
        @play="play()"
        @pause="pause()"
        @next="next()"
        @previous="previous()"
        @seek="seek($event)"
        :playing="playing"
        :disabled="playlist.length === 0"
      ></music-player-controls>
      <v-divider></v-divider>
      <v-card-text>
        <v-select
          hide-details
          outlined
          dense
          label="User"
          item-text="username"
          item-value="user_id"
          :items="$store.getters.userLists"
          clearable
          v-model="selectedUser"
          @change="updatePlaylist()"
        ></v-select>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from '@vue/composition-api'
import { getIdFromURL } from 'vue-youtube-embed'
import MusicPlayerYoutube from '../components/music-player/MusicPlayerYoutube.vue'
import MusicPlayerNormal from '../components/music-player/MusicPlayerNormal.vue'
import MusicPlayerControls from '../components/music-player/MusicPlayerControls.vue'
import { isYoutubeVideo } from '../assets/game-helper'
import { socket } from '../plugins/socket'
import { SHARED_EVENTS } from '../assets/shared/events'
import { store } from '../plugins/store'
import { AqSong } from '../assets/shared/interfaces'

interface State {
  currentTime: number
  maxTime: number
  playing: boolean
  selectedUser: string
  playlist: AqSong[]
  currentSongCount: number
}

export default defineComponent({
  components: { MusicPlayerNormal, MusicPlayerYoutube, MusicPlayerControls },
  setup() {
    const state = reactive<State>({
      currentTime: 0,
      maxTime: 0,
      playing: false,
      selectedUser: '',
      playlist: [],
      currentSongCount: 0
    })

    const youtube = ref()
    const normal = ref()

    let progressCheck: any

    function src(): string {
      if (state.playlist[state.currentSongCount]) {
        return state.playlist[state.currentSongCount].src
      }
      return ''
    }

    function ended(): void {
      next()
    }

    function getPlayer() {
      if (isYoutubeVideo(src())) {
        return youtube
      }
      return normal
    }

    function videoSrc(): string {
      if (!isYoutubeVideo(src())) {
        return src()
      }
      return ''
    }

    function youtubeVideoSrc(): string {
      if (isYoutubeVideo(src())) {
        return getIdFromURL(src())
      }
      return ''
    }

    function startCheckProgress(): void {
      console.log('start progress check')
      clearInterval(progressCheck)
      progressCheck = setInterval(() => {
        state.currentTime = getPlayer().value.getCurrentTime()
      }, 1000)
    }

    function stopCheckProgress(): void {
      console.log('stop progress check')
      clearInterval(progressCheck)
    }

    function play(): void {
      state.playing = true
      getPlayer().value.play()
      startCheckProgress()
    }

    function pause(): void {
      state.playing = false
      getPlayer().value.pause()
      stopCheckProgress()
    }

    function next(): void {
      state.currentSongCount += 1
      if (state.currentSongCount >= state.playlist.length) {
        state.currentSongCount = 0
      }
    }

    function previous(): void {
      state.currentSongCount -= 1
      if (state.currentSongCount < 0) {
        state.currentSongCount = state.playlist.length - 1
      }
    }

    function seek(duration: number): void {
      getPlayer().value.seek(duration)
    }

    function setMaxDuration(duration: number): void {
      state.maxTime = duration
      play()
    }

    function updatePlaylist(): void {
      state.playlist = store.getters.userPlaylist(state.selectedUser)
      state.currentSongCount = 0
    }

    socket.emit(SHARED_EVENTS.GET_SONG_LIST)
    socket.emit(SHARED_EVENTS.GET_USER_LISTS)

    return {
      ...toRefs(state),
      videoSrc,
      ended,
      youtube,
      normal,
      play,
      setMaxDuration,
      pause,
      seek,
      youtubeVideoSrc,
      updatePlaylist,
      next,
      previous
    }
  }
})
</script>
