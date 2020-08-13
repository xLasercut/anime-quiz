<template>
  <v-row justify="center">
    <player-card
      :player="player"
      v-for="player in $store.state.amq.playerList"
      v-model="show"
    >
      {{ guess(player.guess) }}
    </player-card>
  </v-row>
</template>

<script lang="ts">
import {defineComponent, onUnmounted, reactive, toRefs} from '@vue/composition-api'
import PlayerCard from '@/components/game/PlayerCard.vue'
import {socket} from '@/assets/socket'
import {IAmqGuess} from '../../../../shared/interfaces/amq'


export default defineComponent({
  components: {
    PlayerCard
  },
  setup(_props, _context) {
    const state = reactive({
      show: false
    })

    socket.on('AMQ_SHOW_GUESS', (): void => {
      state.show = true

      setTimeout(() => {
        state.show = false
      }, 8000)
    })

    onUnmounted(() => {
      socket.off('AMQ_SHOW_GUESS')
    })

    function guess(guess: IAmqGuess): string {
      let anime = '...'
      let title = '...'

      if (guess.anime) {
        anime = guess.anime
      }

      if (guess.title) {
        title = guess.title
      }

      return `${anime} - ${title}`
    }

    return {...toRefs(state), guess}
  }
})
</script>
