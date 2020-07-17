<template>
  <v-row justify="center">
    <player-card
      :player="player"
      v-for="player in $store.state.amq.playerList"
      v-model="show"
    >
      {{guess(player)}}
    </player-card>
  </v-row>
</template>

<script lang="ts">
  import {defineComponent, onMounted, reactive, toRefs} from '@vue/composition-api'
  import PlayerCard from '@/components/game/PlayerCard.vue'
  import {socket} from '@/assets/socket'
  import {IAmqPlayer} from '../../../../../shared/interfaces/amq'

  export default defineComponent({
    components: {
      PlayerCard
    },
    setup(_props, _context) {
      const state = reactive({
        show: false
      })

      onMounted(() => {
        socket.on('AMQ_SHOW_GUESS', (): void => {
          state.show = true

          setTimeout(() => {
            state.show = false
          }, 8000)
        })
      })

      function guess(player: IAmqPlayer): string {
        let anime = '...'
        let title = '...'

        if (player.guess.anime) {
          anime = player.guess.anime
        }

        if (player.guess.title) {
          title = player.guess.title
        }

        return `${anime} - ${title}`
      }

      return {...toRefs(state), guess}
    }
  })
</script>
