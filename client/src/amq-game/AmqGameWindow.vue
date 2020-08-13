<template>
  <v-col cols="7" sm="8" class="game-window">
    <amq-anime-name-display></amq-anime-name-display>
    <amq-viewport></amq-viewport>
    <amq-guess-input></amq-guess-input>
    <amq-player-list></amq-player-list>
  </v-col>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import AmqPlayerList from '@/amq-game/amq-game-window/AmqPlayerList.vue'
import AmqGuessInput from '@/amq-game/amq-game-window/AmqGuessInput.vue'
import AmqAnimeNameDisplay from '@/amq-game/amq-game-window/AmqAnimeNameDisplay.vue'
import AmqViewport from '@/amq-game/amq-game-window/AmqViewport.vue'


export default defineComponent({
  components: {
    AmqPlayerList, AmqGuessInput, AmqAnimeNameDisplay, AmqViewport
  }
})
</script>
