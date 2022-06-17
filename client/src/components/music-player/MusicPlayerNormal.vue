<template>
  <v-col cols="auto" v-show="src">
    <video
      :src="src"
      @ended="$emit('ended')"
      height="180px"
      width="320px"
      ref="player"
      @playing="$emit('playing')"
      @pause="$emit('paused')"
      autoplay
    ></video>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from '@vue/composition-api';
import { store } from '../../plugins/store';

export default defineComponent({
  props: {
    src: {
      required: true,
      type: String
    }
  },
  setup() {
    const player = ref<HTMLVideoElement>();

    watch(
      () => store.state.client.volume,
      (val: number) => {
        changeVolume(val);
      }
    );

    function changeVolume(volume: number): void {
      if (player.value) {
        player.value.volume = volume / 100;
      }
    }

    onMounted(() => {
      changeVolume(store.state.client.volume);
    });

    function pause(): void {
      if (player.value) {
        player.value.pause();
      }
    }

    function play(): void {
      if (player.value) {
        player.value.play();
      }
    }

    function getMaxTime(): number {
      if (player.value) {
        return player.value.duration;
      }
      return 0;
    }

    function getCurrentTime(): number {
      if (player.value) {
        return player.value.currentTime;
      }
      return 0;
    }

    function seek(duration: number): void {
      if (player.value) {
        player.value.currentTime = duration;
      }
    }

    return {
      player,
      play,
      pause,
      getMaxTime,
      getCurrentTime,
      seek
    };
  }
});
</script>
