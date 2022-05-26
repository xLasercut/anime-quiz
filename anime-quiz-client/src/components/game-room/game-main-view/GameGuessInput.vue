<template>
  <v-card-text>
    <v-row justify="center">
      <v-col>
        <v-combobox
          filled
          clearable
          label="Anime"
          v-model.trim="anime"
          :items="$store.state.songList.animeList"
          hide-details
          @keyup.enter.native="sendGuess()"
        ></v-combobox>
      </v-col>
      <v-col>
        <v-combobox
          filled
          clearable
          label="Title"
          v-model.trim="title"
          :items="$store.state.songList.songTitleList"
          hide-details
          @keyup.enter.native="sendGuess()"
        ></v-combobox>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto">
        Selected Anime: {{ selectedAnime }}
      </v-col>
      <v-col cols="auto">
        Selected Title: {{ selectedTitle }}
      </v-col>
    </v-row>
  </v-card-text>
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

    socket.on(SHARED_EVENTS.UPDATE_GUESS, (guess: AqGameGuess) => {
      state.selectedAnime = guess.anime
      state.selectedTitle = guess.title
    })

    onUnmounted(() => {
      socket.off(SHARED_EVENTS.UPDATE_GUESS)
    })

    function sendGuess(): void {
      const guess: AqGameGuess = {
        anime: state.anime,
        title: state.title
      }
      socket.emit(SHARED_EVENTS.EDIT_GUESS, guess)
    }

    return {
      ...toRefs(state),
      sendGuess
    }
  }
})
</script>
