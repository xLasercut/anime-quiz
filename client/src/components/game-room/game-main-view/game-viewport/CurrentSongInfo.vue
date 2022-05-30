<template>
  <v-col cols="12" sm="3">
    <v-card flat>
      <v-list dense disabled>
        <v-list-item-group>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Title</v-list-item-title>
              <v-list-item-subtitle>
                {{ show ? $store.state.game.currentSong.song_title : '?' }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Artist</v-list-item-title>
              <v-list-item-subtitle>
                {{ show ? $store.state.game.currentSong.artist : '?' }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Type</v-list-item-title>
              <v-list-item-subtitle>
                {{ show ? $store.state.game.currentSong.type : '?' }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>

  </v-col>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, reactive, toRefs } from '@vue/composition-api'
import { SHARED_EVENTS } from '../../../../assets/shared/events'
import { socket } from '../../../../plugins/socket'

export default defineComponent({
  setup() {
    const state = reactive({
      show: false
    })

    socket.on(SHARED_EVENTS.GAME_START_LOAD, () => {
      state.show = false
    })

    socket.on(SHARED_EVENTS.GAME_SHOW_GUESS, () => {
      state.show = true
    })

    onUnmounted(() => {
      socket.off(SHARED_EVENTS.GAME_START_LOAD)
      socket.off(SHARED_EVENTS.GAME_SHOW_GUESS)
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>
