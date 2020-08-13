<template>
  <v-row justify="center">
    <guess-input-field
      label="Anime" :items="$store.state.amq.choices.anime"
      v-model.trim="guess.anime"
    ></guess-input-field>
    <guess-input-field
      label="Title" :items="$store.state.amq.choices.title"
      v-model.trim="guess.title"
    ></guess-input-field>
  </v-row>
</template>

<script lang="ts">
import {defineComponent, onUnmounted, reactive, toRefs} from '@vue/composition-api'
import GuessInputField from '@/components/game/GuessInputField.vue'
import {socket} from '@/assets/socket'

export default defineComponent({
  components: {
    GuessInputField
  },
  setup(_props, _context) {
    const state = reactive({
      guess: {
        title: '',
        anime: ''
      }
    })

    socket.on('AMQ_NEW_SONG', (): void => {
      state.guess.title = ''
      state.guess.anime = ''
    })

    socket.on('AMQ_TIME_UP', (): void => {
      socket.emit('AMQ_GUESS', state.guess)
    })

    onUnmounted(() => {
      socket.off('AMQ_NEW_SONG')
      socket.off('AMQ_TIME_UP')
    })

    return {...toRefs(state)}
  }
})
</script>
