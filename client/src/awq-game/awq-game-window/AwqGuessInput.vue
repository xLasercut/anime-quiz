<template>
  <v-row justify="center">
    <guess-input-field
      label="Anime" :items="$store.state.awq.choices.anime"
      v-model="anime"
    ></guess-input-field>
    <guess-input-field
      label="Weapon" :items="$store.state.awq.choices.weapon"
      v-model="weapon"
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
      weapon: '',
      anime: ''
    })

    socket.on('AMQ_NEW_SONG', (): void => {
      state.weapon = ''
      state.anime = ''
    })

    socket.on('AMQ_TIME_UP', (): void => {
      let guess = {
        title: state.weapon.trim(),
        anime: state.anime.trim()
      }
      socket.emit('AMQ_GUESS', guess)
    })

    onUnmounted(() => {
      socket.off('AMQ_NEW_SONG')
      socket.off('AMQ_TIME_UP')
    })

    return {...toRefs(state)}
  }
})
</script>
