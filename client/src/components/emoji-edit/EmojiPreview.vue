<template>
  <div>
    <v-img :src="emoji.src" width="25pt" v-if="emoji.type === 'img'" aspect-ratio="1"></v-img>
    <span class="normal-emoji" v-else>{{ emoji.src }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { IEmoji } from '../../assets/shared/interfaces';

export default defineComponent({
  props: {
    emoji: {
      required: true,
      type: Object as PropType<IEmoji>
    }
  }
});
</script>

<style scoped>
.normal-emoji {
  font-size: 20pt;
}
</style>
