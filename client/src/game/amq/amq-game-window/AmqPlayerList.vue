<template>
  <v-row justify="center">
    <player-card
      :player="player"
      v-for="player in $store.state.amq.playerList"
      v-model="show"
    >
      {{player.guess}}
    </player-card>
  </v-row>
</template>

<script lang="ts">
  import {defineComponent, onMounted, reactive, toRefs} from '@vue/composition-api'
  import PlayerCard from '@/components/game/PlayerCard.vue'
  import {socket} from '@/assets/socket'

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
        })
      })

      return {...toRefs(state)}
    }
  })
</script>
