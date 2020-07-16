<template>
  <v-row justify="center">
    <guess-input-field
      label="Anime" :items="$store.state.list.choices.anime"
      v-model.trim="guess.anime"
    ></guess-input-field>
    <guess-input-field
      label="Title" :items="$store.state.list.choices.title"
      v-model.trim="guess.title"
    ></guess-input-field>
  </v-row>
</template>

<script lang="ts">
  import {defineComponent, onMounted, reactive, toRefs} from '@vue/composition-api'
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

      onMounted(() => {
        socket.on('AMQ_NEW_SONG', (): void => {
          state.guess.title = ''
          state.guess.anime = ''
        })

        socket.on('AMQ_TIME_UP', (): void => {
          socket.emit('AMQ_GUESS', state.guess)
        })
      })

      return {...toRefs(state)}
    }
  })
</script>
