<template>
  <v-row justify="center">
    <v-col cols="12" sm="6">
      <v-combobox
        filled
        label="Anime"
        v-model.trim="anime"
        :items="$store.state.songList.animeList"
        @keyup.enter.native="sendGuess()"
        @change="sendGuess()"
        persistent-hint
        :hint="`Selected Anime: ${selectedAnime}`"
        :disabled="disabled"
      ></v-combobox>
    </v-col>
    <v-col cols="12" sm="6">
      <v-combobox
        filled
        label="Title"
        v-model.trim="title"
        :items="$store.state.songList.songTitleList"
        @keyup.enter.native="sendGuess()"
        @change="sendGuess()"
        persistent-hint
        :hint="`Selected Title: ${selectedTitle}`"
        :disabled="disabled"
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
      title: '',
      selectedAnime: '',
      selectedTitle: '',
      disabled: true
    })

    socket.on(SHARED_EVENTS.GAME_NEW_ROUND, () => {
      state.anime = ''
      state.title = ''
      state.selectedAnime = ''
      state.selectedTitle = ''
      state.disabled = false
    })

    socket.on(SHARED_EVENTS.UPDATE_GUESS, (guess: AqGameGuess) => {
      state.selectedAnime = guess.anime
      state.selectedTitle = guess.title
    })

    socket.on(SHARED_EVENTS.GAME_SHOW_GUESS, () => {
      state.disabled = true
    })

    function sendGuess(): void {
      const guess: AqGameGuess = {
        anime: state.anime,
        title: state.title
      }
      socket.emit(SHARED_EVENTS.EDIT_GUESS, guess)
    }

    onUnmounted(() => {
      socket.off(SHARED_EVENTS.GAME_NEW_ROUND)
      socket.off(SHARED_EVENTS.UPDATE_GUESS)
      socket.off(SHARED_EVENTS.GAME_SHOW_GUESS)
    })

    return {
      ...toRefs(state),
      sendGuess
    }
  }
})
</script>
