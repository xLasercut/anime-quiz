<template>
  <v-row justify="center">
    <v-col cols="auto">
      Selected Anime: {{ anime }}
    </v-col>
    <v-col cols="auto">
      Selected Title: {{ title }}
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

    socket.on(SHARED_EVENTS.UPDATE_GUESS, (guess: AqGameGuess) => {
      state.anime = guess.anime
      state.title = guess.title
    })

    onUnmounted(() => {
      socket.off(SHARED_EVENTS.UPDATE_GUESS)
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>
