<template>
  <v-row :dense="true">
    <v-col cols="auto">
      <div class="music-player-container">
        <media-player
          class="music-player"
          ref="player"
          autoplay
          :src="song.src"
          :currentTime="currentTime"
          @pause="playing = false"
          @play="playing = true"
          :volume="clientStore.volume / 100"
          @ended="playbackEnded = true"
          @source-change="playbackEnded = false"
          @time-update="updateCurrentTime($event)"
          @duration-change="updateDuration($event)"
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
import { SongType } from '@/assets/shared/models/types';
import MusicPlayerTablePlayerControls from '@/components/music-player/MusicPlayerTablePlayerControls.vue';
import { MediaDurationChangeEvent, MediaTimeUpdateEvent } from 'vidstack';

const props = defineProps({
  song: {
    required: true,
    type: Object as PropType<SongType>
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

watch(
  () => playbackEnded.value,
  (val: boolean) => {
    if (val) {
      emit('next');
    }
  }
);

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

.music-player {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  border: none;
}
</style>
