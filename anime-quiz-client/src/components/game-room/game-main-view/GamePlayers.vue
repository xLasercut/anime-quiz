<template>
  <v-card-text>
    <v-row justify="center">
      <v-col v-for="player in $store.state.game.players" cols="auto">
        <div>
          {{player.username}}
          {{player.score}}
          <br>
          <game-avatar :avatar="player.avatar" :size="100"></game-avatar>
        </div>
      </v-col>
    </v-row>
  </v-card-text>
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

    return {
      ...toRefs(state)
    }
  }
})
</script>
