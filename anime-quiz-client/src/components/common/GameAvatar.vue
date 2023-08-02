<template>
  <v-avatar :style="avatarStyle()" v-bind="$attrs" :image="getAvatarUrl()"></v-avatar>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { AVATAR_MAP } from '@/assets/avatars';
import { AvatarType } from '@/assets/shared/models/types';

export default defineComponent({
  props: {
    avatar: {
      type: String as PropType<AvatarType>,
      required: true
    }
  },
  setup(props) {
    function getAvatarUrl(): string {
      return AVATAR_MAP[props.avatar] || 'https://i.imgur.com/dFFwfIx.jpg';
    }

    function avatarStyle() {
      return {
        border: '1px solid rgb(var(--v-theme-on-surface))'
      };
    }

    return {
      getAvatarUrl,
      avatarStyle
    };
  }
});
</script>

<style scoped>
img {
  border: 1px solid black;
}
</style>
