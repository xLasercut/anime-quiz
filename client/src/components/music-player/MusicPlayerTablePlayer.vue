<template>
  <v-row :dense="true">
    <v-col cols="auto">
      <div class="music-player-container">
        <media-player
          ref="player"
          :autoplay="false"
          :src="mediaSrc()"
          :currentTime="currentTime"
          @pause="playing = false"
          :volume="volume / 10000"
          @play="playing = true"
          @ended="playbackEnded = true"
          @source-change="playbackEnded = false"
          @time-update="updateCurrentTime($event)"
          @duration-change="updateDuration($event)"
          load="eager"
          @can-play="playMusic"
          :muted="muted"
        >
          <media-provider></media-provider>
        </media-player>
      </div>
    </v-col>
    <music-player-table-player-controls
      @seek="currentTime = $event"
      :current-time="currentTime"
      :duration="duration"
      @pause="pause()"
      @play="play()"
      :playing="playing"
      @next="$emit('next')"
      @previous="$emit('previous')"
      :shuffle="shuffle"
      @update:shuffle="$emit('update:shuffle', $event)"
    ></music-player-table-player-controls>
  </v-row>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import { useClientStore } from '@/plugins/store/client';
import { TSong } from 'anime-quiz-shared-resources';
import MusicPlayerTablePlayerControls from '@/components/music-player/MusicPlayerTablePlayerControls.vue';
import { MediaDurationChangeEvent, MediaTimeUpdateEvent } from 'vidstack';

const props = defineProps({
  song: {
    required: true,
    type: Object as PropType<TSong>
  },
  shuffle: {
    required: true,
    type: Boolean
  }
});

const emit = defineEmits(['next', 'previous', 'play', 'set-initial-song', 'update:shuffle']);

const clientStore = useClientStore();

const player = ref<any>(null);
const currentTime = ref(0);
const duration = ref(-1);
const playing = ref(false);
const playbackEnded = ref(false);
const volume = ref(clientStore.volume);
const muted = ref(false);

watch(
  () => clientStore.volume,
  (value) => {
    volume.value = value;
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

async function playMusic() {
  player.value.play();
  // TODO: vidstack bug, need to set to mute then quickly change volume, waiting for fix in package
  setTimeout(() => {
    muted.value = true;
    volume.value = clientStore.volume;
    muted.value = false;
  }, 0);
}

function mediaSrc(): string {
  if (clientStore.audioOnly && props.song.audioSrc) {
    return props.song.audioSrc;
  }
  return props.song.src;
}

function updateCurrentTime(event: MediaTimeUpdateEvent) {
  currentTime.value = event.detail.currentTime;
}

function updateDuration(event: MediaDurationChangeEvent) {
  duration.value = event.detail;
}

function play() {
  if (props.song.songId) {
    player.value.play();
  } else {
    emit('set-initial-song');
  }
}

function pause() {
  player.value.pause();
}
</script>

<style scoped>
.music-player-container {
  width: 400px;
  max-width: 400px;
  height: 225px;
  max-height: 225px;
}

media-player {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
