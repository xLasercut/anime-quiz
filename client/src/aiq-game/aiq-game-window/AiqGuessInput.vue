<template>
  <v-row justify="center">
    <guess-input-field
      label="Anime" :items="$store.state.aiq.choices.anime"
      v-model="anime"
    ></guess-input-field>
    <guess-input-field
      label="Name" :items="$store.state.aiq.choices.name"
      v-model="name"
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
      name: '',
      anime: ''
    })

    socket.on('AIQ_NEW_IMAGE', (): void => {
      state.name = ''
      state.anime = ''
    })

    socket.on('AMQ_TIME_UP', (): void => {
      let guess = {
        title: state.name.trim(),
        anime: state.anime.trim()
      }
      socket.emit('AMQ_GUESS', guess)
    })

    onUnmounted(() => {
      socket.off('AIQ_NEW_IMAGE')
      socket.off('AMQ_TIME_UP')
    })

    return {...toRefs(state)}
  }
})
</script>
