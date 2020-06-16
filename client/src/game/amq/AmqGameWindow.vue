<template>
  <v-col cols="7" sm="8" class="game-window">
    <amq-anime-name-display></amq-anime-name-display>
    <amq-guess-input></amq-guess-input>
    <amq-player-list></amq-player-list>
  </v-col>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'
  import AmqPlayerList from '@/game/amq/amq-game-window/AmqPlayerList.vue'
  import AmqGuessInput from '@/game/amq/amq-game-window/AmqGuessInput.vue'
  import AmqAnimeNameDisplay from '@/game/amq/amq-game-window/AmqAnimeNameDisplay.vue'

  export default defineComponent({
    components: {
      AmqPlayerList, AmqGuessInput, AmqAnimeNameDisplay
    }
  })
</script>
