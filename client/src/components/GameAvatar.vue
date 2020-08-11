<template>
  <v-avatar v-bind="$attrs">
    <v-img :src="$store.getters.avatarImage(avatar)"></v-img>
  </v-avatar>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'

export default defineComponent({
  props: {
    avatar: {
      required: true
    }
  }
})
</script>
