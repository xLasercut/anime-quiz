<template>
  <v-col cols="12" sm="6">
    <v-row justify="center" no-gutters>
      <v-col class="video-container">
        <amq-normal-video></amq-normal-video>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'
  import AmqNormalVideo from '@/game/amq/amq-game-window/amq-viewport/amq-video-window/AmqNormalVideo.vue'

  export default defineComponent({
    components: {
      AmqNormalVideo
    }
  })
</script>

<style scoped>
  .video-container {
    height: 200px;
    text-align: center;
    padding: 10px;
    max-width: 352px;
  }
</style>
