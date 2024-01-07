<template>
  <v-row :dense="true">
    <v-col cols="auto">
      <div class="music-player-container">
        <Player
          :currentTime="currentTime"
          :volume="volume"
          ref="player"
          @vmDurationChange="updateDuration"
          @vmCurrentTimeChange="updateCurrentTime"
          @vmPlaybackReady="autoPlayVideo()"
          @vmPausedChange="pauseChanged"
          @vmPlaybackEnded="playbackEnded = true"
        >
          <Video v-if="showNormal()">
            <source :data-src="song.src" />
          </Video>
          <Youtube :video-id="getVideoId(song.src)" v-if="showYoutube()"></Youtube>
        </Player>
      </div>
    </v-col>
    <music-player-table-player-controls
      @seek="updateCurrentTime"
      :current-time="currentTime"
      :duration="duration"
      @pause="pause()"
      @play="play()"
      :playing="playing"
      @next="$emit('next')"
      @previous="$emit('previous')"
    ></music-player-table-player-controls>
  </v-row>
</template>

<script setup lang="ts">
import { Player, Video, Youtube } from '@vime/vue-next';
import { nextTick, PropType, ref, watch } from 'vue';
import { useClientStore } from '@/plugins/store/client';
import { SongType } from '@/assets/shared/models/types';
import { getVideoId, isYoutubeVideo } from '@/assets/game-helpers';
import MusicPlayerTablePlayerControls from '@/components/music-player/MusicPlayerTablePlayerControls.vue';

const props = defineProps({
  song: {
    required: true,
    type: Object as PropType<SongType>
  },
  disabled: {
    required: true,
    type: Boolean
  }
});

const emit = defineEmits(['next', 'previous', 'play']);

const clientStore = useClientStore();

const player = ref<any>(null);
const currentTime = ref(0);
const duration = ref(-1);
const volume = ref(clientStore.volume);
const playing = ref(false);
const playbackEnded = ref(false);

watch(
  () => clientStore.volume,
  (val: number) => {
    volume.value = val;
  }
);

watch(
  () => playbackEnded.value,
  (val: boolean) => {
    if (val) {
      emit('next');
    }
  }
);

function showYoutube(): boolean {
  return isYoutubeVideo(props.song.src) && !props.disabled;
}

function showNormal(): boolean {
  return !isYoutubeVideo(props.song.src) && !props.disabled;
}

function updateCurrentTime(val: any) {
  currentTime.value = val;
}

function updateDuration(val: any) {
  duration.value = val;
}

async function resetVolume() {
  await nextTick(() => {
    if (clientStore.volume >= 100) {
      volume.value = clientStore.volume - 1;
    } else {
      volume.value = clientStore.volume + 1;
    }
  });
  await nextTick(() => {
    volume.value = clientStore.volume;
  });
}

async function autoPlayVideo() {
  await resetVolume();
  await nextTick(() => {});
  await nextTick(() => {
    play();
  });
  playbackEnded.value = false;
}

function play() {
  player.value.play();
  emit('play');
}

function pause() {
  player.value.pause();
}

function pauseChanged(val: any) {
  playing.value = !val;
}
</script>

<style scoped>
.music-player-container {
  width: 400px;
  max-width: 400px;
}
</style>
