<template>
  <v-avatar :style="avatarStyle()" v-bind="$attrs" :image="getAvatarUrl()"></v-avatar>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { AVATAR_MAP } from '@/assets/avatars';
import { TAvatar } from 'anime-quiz-shared-resources';

const props = defineProps({
  avatar: {
    type: String as PropType<TAvatar>,
    required: true
  },
  border: {
    type: Boolean,
    default: (): boolean => {
      return true;
    }
  }
});

function getAvatarUrl(): string {
  return AVATAR_MAP[props.avatar] || `https://cdn.imgchest.com/files/8d0ef62a4df9.jpg`;
}

function avatarStyle() {
  if (props.border) {
    return {
      border: '1px solid rgb(var(--v-theme-on-surface))'
    };
  }
  return {};
}
</script>
