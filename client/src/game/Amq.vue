<template>
  <v-row justify="center">
    <amq-game-window></amq-game-window>
  </v-row>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'
  import AmqGameWindow from '@/game/amq/AmqGameWindow.vue'

  export default defineComponent({
    components: {
      AmqGameWindow
    }
  })
</script>
