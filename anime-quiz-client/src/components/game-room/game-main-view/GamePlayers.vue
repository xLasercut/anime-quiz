<template>
  <v-row justify="center">
    <v-col v-for="player in $store.state.game.players" cols="auto">
      <v-row no-gutters justify="center">
        <v-badge tile overlap dot :color="badgeColor(player)">
          <game-avatar :avatar="player.avatar" :size="100"></game-avatar>
        </v-badge>
      </v-row>
      <v-row no-gutters justify="center">
        <v-sheet>
          {{player.username}}
        </v-sheet>
      </v-row>
      <v-row no-gutters justify="center">
        <v-sheet>
          {{player.score}}
        </v-sheet>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { AqGamePlayer } from '../../../assets/shared/interfaces'
import GameAvatar from '../../shared/GameAvatar.vue'

interface State {
  players: AqGamePlayer[]
}

export default defineComponent({
  components: { GameAvatar },
  setup() {
    const state = reactive<State>({
      players: []
    })

    function badgeColor(player: AqGamePlayer): string {
      if (player.admin) {
        return 'warning'
      }

      if (player.host) {
        return 'info'
      }

      return 'primary'
    }

    return {
      ...toRefs(state),
      badgeColor
    }
  }
})
</script>
