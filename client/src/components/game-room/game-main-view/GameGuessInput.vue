<template>
  <v-row justify="center">
    <v-col>
      <v-combobox
        filled
        label="Anime"
        v-model.trim="anime"
        :items="$store.state.songList.animeList"
        @keyup.enter.native="sendGuess()"
        persistent-hint
        :hint="`Selected Anime: ${selectedAnime}`"
      ></v-combobox>
    </v-col>
    <v-col>
      <v-combobox
        filled
        label="Title"
        v-model.trim="title"
        :items="$store.state.songList.songTitleList"
        @keyup.enter.native="sendGuess()"
        persistent-hint
        :hint="`Selected Title: ${selectedTitle}`"
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
      selectedTitle: ''
    })

    socket.on(SHARED_EVENTS.GAME_NEW_ROUND, () => {
      state.anime = ''
      state.title = ''
      state.selectedAnime = ''
      state.selectedTitle = ''
    })

    socket.on(SHARED_EVENTS.UPDATE_GUESS, (guess: AqGameGuess) => {
      state.selectedAnime = guess.anime
      state.selectedTitle = guess.title
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
    })

    return {
      ...toRefs(state),
      sendGuess
    }
  }
})
</script>
