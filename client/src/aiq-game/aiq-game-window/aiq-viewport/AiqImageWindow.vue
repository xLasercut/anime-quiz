<template>
  <v-col cols="12" sm="6">
    <v-row justify="center" no-gutters>
      <v-col class="game-display-container">
        <aiq-image></aiq-image>
        <aiq-loading-circle></aiq-loading-circle>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import AiqImage from '@/aiq-game/aiq-game-window/aiq-viewport/aiq-image-window/AiqImage.vue'
import AiqLoadingCircle from '@/aiq-game/aiq-game-window/aiq-viewport/aiq-image-window/AiqLoadingCircle.vue'


export default defineComponent({
  components: {
    AiqLoadingCircle, AiqImage
  },
  setup(_props, _context) {
  }
})
</script>
