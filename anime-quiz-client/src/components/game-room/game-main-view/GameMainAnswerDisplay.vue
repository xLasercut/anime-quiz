<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-row no-gutters justify="center">
        <v-col cols="5" sm="3" md="2">
          <v-sheet class="count-container">
            {{ $store.state.game.currentSongCount }} / {{ $store.state.game.maxSongCount }}
          </v-sheet>
        </v-col>
      </v-row>
      <v-row no-gutters justify="center">
        <v-col cols="12" sm="8" md="6" lg="5">
          <v-sheet class="answer-container">
            {{ show ? $store.state.game.currentSong.anime_name[0] : '?' }}
          </v-sheet>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const state = reactive({
      show: false
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>

<style scoped>
.count-container {
  border-radius: 20px 20px 0 0;
  text-align: center;
}

.answer-container {
  font-size: 16pt;
  text-align: center;
  border-radius: 5px;
}
</style>
