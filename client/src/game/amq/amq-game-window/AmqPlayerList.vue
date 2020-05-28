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
  import {defineComponent, reactive, toRefs} from '@vue/composition-api'
  import PlayerAvatar from '@/components/game/PlayerAvatar.vue'
  import PlayerCard from '@/components/game/PlayerCard.vue'

  export default defineComponent({
    components: {
      PlayerCard
    },
    setup(_props, _context) {
      const state = reactive({
        show: false
      })

      return {...toRefs(state)}
    }
  })
</script>
