<template>
  <v-row>
    <v-col cols="12" sm="3"></v-col>
    <amq-video-window></amq-video-window>
    <amq-song-info></amq-song-info>
  </v-row>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'
  import AmqVideoWindow from '@/game/amq/amq-game-window/amq-viewport/AmqVideoWindow.vue'
  import AmqSongInfo from '@/game/amq/amq-game-window/amq-viewport/AmqSongInfo.vue'

  export default defineComponent({
    components: {
      AmqVideoWindow, AmqSongInfo
    }
  })
</script>
