<template>
  <v-row justify="center">
    <player-card
      :player="player"
      v-for="player in $store.state.aiq.playerList"
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
import {IAiqGuess} from '../../../../shared/interfaces/aiq'


export default defineComponent({
  components: {
    PlayerCard
  },
  setup(_props, _context) {
    const state = reactive({
      show: false
    })

    socket.on('AIQ_SHOW_GUESS', (): void => {
      state.show = true

      setTimeout(() => {
        state.show = false
      }, 8000)
    })

    onUnmounted(() => {
      socket.off('AIQ_SHOW_GUESS')
    })

    function guess(guess: IAiqGuess): string {
      let anime = '...'
      let name = '...'

      if (guess.anime) {
        anime = guess.anime
      }

      if (guess.name) {
        name = guess.name
      }

      return `${anime} - ${name}`
    }

    return {...toRefs(state), guess}
  }
})
</script>
