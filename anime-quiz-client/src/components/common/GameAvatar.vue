<template>
  <v-avatar :style="avatarStyle()" v-bind="$attrs" :image="getAvatarUrl()"></v-avatar>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { AVATAR_MAP } from '@/assets/avatars';
import { AvatarType } from '@/assets/shared/models/types';

const props = defineProps({
  avatar: {
    type: String as PropType<AvatarType>,
    required: true
  }
});

function getAvatarUrl(): string {
  return AVATAR_MAP[props.avatar] || 'https://i.imgur.com/dFFwfIx.jpg';
}

function avatarStyle() {
  return {
    border: '1px solid rgb(var(--v-theme-on-surface))'
  };
}
</script>

<style scoped>
img {
  border: 1px solid black;
}
</style>
