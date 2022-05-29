<template>
  <v-row justify="center">
    <v-col>
      <v-combobox
        filled
        label="Anime"
        v-model.trim="anime"
        :items="$store.getters.animeList"
        hide-details
        @keyup.enter.native="sendGuess()"
      ></v-combobox>
    </v-col>
    <v-col>
      <v-combobox
        filled
        label="Title"
        v-model.trim="title"
        :items="$store.state.songList.songTitleList"
        hide-details
        @keyup.enter.native="sendGuess()"
      ></v-combobox>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, reactive, toRefs } from '@vue/composition-api'
import { socket } from '../../../plugins/socket'
import { SHARED_EVENTS } from '../../../assets/shared/events'
import { AqGameGuess } from '../../../assets/shared/interfaces'

export default defineComponent({
  setup() {
    const state = reactive({
      anime: '',
      title: ''
    })

    socket.on(SHARED_EVENTS.GAME_START_LOAD, () => {
      state.anime = ''
      state.title = ''
    })

    function sendGuess(): void {
      const guess: AqGameGuess = {
        anime: state.anime,
        title: state.title
      }
      socket.emit(SHARED_EVENTS.EDIT_GUESS, guess)
    }

    onUnmounted(() => {
      socket.off(SHARED_EVENTS.GAME_START_LOAD)
    })

    return {
      ...toRefs(state),
      sendGuess
    }
  }
})
</script>
