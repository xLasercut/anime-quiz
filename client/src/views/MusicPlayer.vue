<template>
  <v-main>
    <v-card flat>
      <v-card-text>
        <v-row justify="center">
          <music-player-youtube
            ref="youtube"
            @playing="startCheckProgress()"
            @paused="stopCheckProgress()"
            @ended="ended()"
            :src="youtubeVideoSrc()"
          ></music-player-youtube>
          <music-player-normal
            ref="normal"
            @playing="startCheckProgress()"
            @paused="stopCheckProgress()"
            @ended="ended()"
            :src="videoSrc()"
          ></music-player-normal>
          <music-player-controls
            :current-time="currentTime"
            :max-time="maxTime"
            @play="play()"
            @pause="pause()"
            @next="next()"
            @previous="previous()"
            @seek="seek($event)"
            :playing="playing"
          ></music-player-controls>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <music-player-playlist
        :selected-user.sync="selectedUser"
        @update:playlist="updatePlaylist()"
        @change:song="changeSong($event)"
        :playlist="playlist"
        :current-song="currentSong"
      ></music-player-playlist>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from '@vue/composition-api';
import { getIdFromURL } from 'vue-youtube-embed';
import MusicPlayerYoutube from '../components/music-player/MusicPlayerYoutube.vue';
import MusicPlayerNormal from '../components/music-player/MusicPlayerNormal.vue';
import MusicPlayerControls from '../components/music-player/MusicPlayerControls.vue';
import { isYoutubeVideo } from '../assets/game-helper';
import { socket } from '../plugins/socket';
import { SHARED_EVENTS } from '../assets/shared/events';
import { store } from '../plugins/store';
import { ISong } from '../assets/shared/interfaces';
import MusicPlayerPlaylist from '../components/music-player/MusicPlayerPlaylist.vue';
import { shuffleSongList } from '../assets/shared/helpers';

interface State {
  currentTime: number;
  maxTime: number;
  playing: boolean;
  selectedUser: string;
  playlist: ISong[];
  currentSongCount: number;
  currentSong: ISong;
}

export default defineComponent({
  components: { MusicPlayerPlaylist, MusicPlayerNormal, MusicPlayerYoutube, MusicPlayerControls },
  setup() {
    const state = reactive<State>({
      currentTime: 0,
      maxTime: 0,
      playing: false,
      selectedUser: '',
      playlist: [],
      currentSongCount: 0,
      currentSong: {
        src: '',
        artist: '',
        anime_id: [],
        anime_name: [],
        song_id: '',
        song_title: '',
        type: 'OP'
      }
    });

    const youtube = ref();
    const normal = ref();

    let progressCheck: any;

    function _changeSong(): void {
      if (state.playlist.length > 0) {
        state.currentSong = state.playlist[state.currentSongCount];
      }
    }

    function ended(): void {
      next();
    }

    function getPlayer() {
      if (isYoutubeVideo(state.currentSong.src)) {
        return youtube;
      }
      return normal;
    }

    function videoSrc(): string {
      if (!isYoutubeVideo(state.currentSong.src)) {
        return state.currentSong.src;
      }
      return '';
    }

    function youtubeVideoSrc(): string {
      if (isYoutubeVideo(state.currentSong.src)) {
        return getIdFromURL(state.currentSong.src);
      }
      return '';
    }

    function startCheckProgress(): void {
      console.log('start progress check');
      clearInterval(progressCheck);
      state.playing = true;
      state.maxTime = getPlayer().value.getMaxTime();
      progressCheck = setInterval(() => {
        state.currentTime = getPlayer().value.getCurrentTime();
      }, 500);
    }

    function stopCheckProgress(): void {
      console.log('stop progress check');
      state.playing = false;
      clearInterval(progressCheck);
    }

    function play(): void {
      _changeSong();
      getPlayer().value.play();
    }

    function pause(): void {
      getPlayer().value.pause();
    }

    function next(): void {
      state.currentSongCount += 1;
      if (state.currentSongCount >= state.playlist.length) {
        state.currentSongCount = 0;
      }
      _changeSong();
    }

    function previous(): void {
      state.currentSongCount -= 1;
      if (state.currentSongCount < 0) {
        state.currentSongCount = state.playlist.length - 1;
      }
      _changeSong();
    }

    function seek(duration: number): void {
      getPlayer().value.seek(duration);
    }

    function updatePlaylist(): void {
      state.playlist = shuffleSongList(store.getters.userPlaylist(state.selectedUser));
      state.currentSongCount = 0;
    }

    function changeSong(index: number): void {
      state.currentSongCount = index;
      _changeSong();
    }

    socket.emit(SHARED_EVENTS.GET_SONG_LIST);
    socket.emit(SHARED_EVENTS.GET_USER_LISTS);

    return {
      ...toRefs(state),
      videoSrc,
      ended,
      youtube,
      normal,
      play,
      pause,
      seek,
      youtubeVideoSrc,
      updatePlaylist,
      next,
      previous,
      startCheckProgress,
      stopCheckProgress,
      changeSong
    };
  }
});
</script>
