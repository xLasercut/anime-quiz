<template>
  <video>
    <source :src="$store.state.amq.gameState.currentSong.src">
    Your browser does not support video element
  </video>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'

  export default defineComponent({})
</script>

<style scoped>
  video {
    max-height: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
  }
</style>
