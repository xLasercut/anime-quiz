<template>
  <v-col>
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn icon="mdi-skip-backward" variant="flat" color="primary" @click="$emit('previous')"></v-btn>
      </v-col>
      <v-col cols="auto" v-if="!playing">
        <v-btn icon="mdi-play" variant="flat" color="success" @click="$emit('play')"></v-btn>
      </v-col>
      <v-col cols="auto" v-if="playing">
        <v-btn icon="mdi-pause" variant="flat" color="warning" @click="$emit('pause')"></v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn icon="mdi-skip-forward" variant="flat" color="primary" @click="$emit('next')"></v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="10">
        <v-slider
          :min="0"
          :max="duration"
          :model-value="sliderDisplayTime"
          @mousedown="seeking = true"
          @mouseup="seeking = false"
          :hide-details="true"
          :thumb-label="true"
          :thumb-size="20"
          color="warning"
          @end="$emit('seek', $event)"
        >
          <template #thumb-label="{ modelValue }">
            {{ getTimestamp(modelValue) }}
          </template>
        </v-slider>
      </v-col>
    </v-row>
    <v-row justify="center"> {{ getTimestamp(currentTime) }} / {{ getTimestamp(duration) }}</v-row>
    <v-row justify="center">
      <v-col cols="auto">
        <v-checkbox-btn
          true-icon="mdi-shuffle"
          false-icon="mdi-shuffle-disabled"
          color="info"
          base-color="primary"
          density="compact"
          :model-value="shuffle"
          @update:model-value="$emit('update:shuffle', $event)"
        ></v-checkbox-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits(['seek', 'previous', 'play', 'pause', 'next', 'update:shuffle']);

const props = defineProps({
  duration: {
    required: true,
    type: Number
  },
  currentTime: {
    required: true,
    type: Number
  },
  playing: {
    required: true,
    type: Boolean
  },
  shuffle: {
    required: true,
    type: Boolean
  }
});

const sliderDisplayTime = ref(props.currentTime);
const seeking = ref(false);

watch(
  () => props.currentTime,
  (val: number) => {
    if (!seeking.value) {
      sliderDisplayTime.value = val;
    }
  }
);

function getTimestamp(time: number): string {
  if (time < 3600) {
    return new Date(time * 1000).toISOString().substring(14, 19);
  }
  return new Date(time * 1000).toISOString().substring(11, 16);
}
</script>
