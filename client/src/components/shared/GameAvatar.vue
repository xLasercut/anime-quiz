<template>
  <v-avatar v-bind="$attrs">
    <img :src="getAvatarUrl(avatar)" />
  </v-avatar>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { getAvatarUrl } from '../../assets/avatar'

export default defineComponent({
  props: {
    avatar: {
      type: String,
      required: true
    }
  },
  setup() {
    return {
      getAvatarUrl
    }
  }
})
</script>

<style scoped>
img {
  border: 1px solid black;
}
</style>
