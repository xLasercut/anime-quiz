<template>
  <v-row justify="center">
    <player-card
      :player="player"
      v-for="player in $store.state.awq.playerList"
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
import {IAwqGuess} from '../../../../shared/interfaces/awq'


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

    function guess(guess: IAwqGuess): string {
      let anime = '...'
      let weapon = '...'

      if (guess.anime) {
        anime = guess.anime
      }

      if (guess.weapon) {
        weapon = guess.weapon
      }

      return `${anime} - ${weapon}`
    }

    return {...toRefs(state), guess}
  }
})
</script>
