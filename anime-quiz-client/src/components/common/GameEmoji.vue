<template>
  <v-img :src="emoji.src" v-if="emoji.type === 'img'" aspect-ratio="1"></v-img>
  <span v-else class="normal-emoji">{{ emoji.src }}</span>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { EmojiType } from '@/assets/shared/models/types';

defineProps({
  emoji: {
    required: true,
    type: Object as PropType<EmojiType>
  }
});
</script>

<style scoped>
.normal-emoji {
  font-size: 20pt;
}
</style>
