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
  import {defineComponent, reactive, toRefs} from '@vue/composition-api'
  import GuessInputField from '@/components/game/GuessInputField.vue'

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

      return {...toRefs(state)}
    }
  })
</script>
