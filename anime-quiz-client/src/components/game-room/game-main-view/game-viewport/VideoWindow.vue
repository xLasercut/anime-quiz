<template>
  <v-col cols="12" sm="6">
    <v-row justify="center" no-gutters>
      <v-col cols="12">
        <normal-video></normal-video>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import NormalVideo from './video-window/NormalVideo.vue'

export default defineComponent({
  components: { NormalVideo }
})
</script>
