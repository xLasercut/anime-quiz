<template>
  <v-row justify="center">
    <guess-input-field
      label="Anime" :items="$store.state.amq.choices.anime"
      v-model="anime"
      @key:enter="submitGuess()"
      :disabled="disabled"
      :submitted="submitted"
    ></guess-input-field>
    <guess-input-field
      label="Title" :items="$store.state.amq.choices.title"
      v-model="title"
      @key:enter="submitGuess()"
      :disabled="disabled"
      :submitted="submitted"
    ></guess-input-field>
  </v-row>
</template>

<script lang="ts">
import {defineComponent, onUnmounted, reactive, toRefs} from '@vue/composition-api'
import GuessInputField from '@/components/game/GuessInputField.vue'
import {socket} from '@/assets/socket'
import IconBtn from '@/components/buttons/IconBtn.vue'

export default defineComponent({
  components: {
    GuessInputField, IconBtn
  },
  setup(_props, _context) {
    const state = reactive({
      title: '',
      anime: '',
      disabled: true,
      submitted: false
    })

    socket.on('AMQ_NEW_SONG', (): void => {
      state.title = ''
      state.anime = ''
      state.disabled = false
      state.submitted = false
    })

    socket.on('AMQ_TIME_UP', (): void => {
      submitGuess()
      state.disabled = true
    })

    function submitGuess(): void {
      let guess = {
        title: state.title.trim(),
        anime: state.anime.trim()
      }
      socket.emit('AMQ_GUESS', guess)
      state.submitted = true
    }

    onUnmounted(() => {
      socket.off('AMQ_NEW_SONG')
      socket.off('AMQ_TIME_UP')
    })

    return {...toRefs(state), submitGuess}
  }
})
</script>
