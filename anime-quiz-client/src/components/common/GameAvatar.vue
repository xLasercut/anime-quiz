<template>
  <v-avatar :style="avatarStyle()" v-bind="$attrs" :image="getAvatarUrl()"></v-avatar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AVATAR_MAP } from '@/assets/avatars';

export default defineComponent({
  props: {
    avatar: {
      type: String,
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
