<template>
  <div>
    <v-img :src="emoji.src" width="25pt" v-if="emoji.type === 'img'" aspect-ratio="1"></v-img>
    <span class="normal-emoji" v-else>{{emoji.src}}</span>
  </div>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import {IEmoji} from '../../../shared/interfaces/database'


interface IProp {
  emoji: IEmoji
}

export default defineComponent<IProp>({
  props: {
    emoji: {
      required: true
    }
  }
})
</script>

<style scoped>
.normal-emoji {
  font-size: 20pt;
}
</style>
