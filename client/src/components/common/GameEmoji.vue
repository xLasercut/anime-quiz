<template>
  <v-img :src="emoji.src" v-if="emoji.type === 'img'" aspect-ratio="1" :width="size"></v-img>
  <span v-else :style="spanStyles">{{ emoji.src }}</span>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { TEmoji } from 'anime-quiz-shared-resources/src/models/types';

const props = defineProps({
  emoji: {
    required: true,
    type: Object as PropType<TEmoji>
  },
  size: {
    type: String,
    default: (): string => {
      return '20pt';
    }
  }
});

const spanStyles = computed(() => {
  return {
    'font-size': props.size
  };
});
</script>
