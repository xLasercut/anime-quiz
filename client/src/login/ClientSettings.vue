<template>
  <v-form v-model="valid" @submit.prevent="setGameServer()">
    <v-row justify="center" dense>
      <dialog-text v-model.trim="server" label="Game Server" :rules="rules"></dialog-text>
      <dialog-confirm-btn :disabled="!valid"></dialog-confirm-btn>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from '@vue/composition-api'
import DialogText from '@/components/dialog/DialogText.vue'
import DialogConfirmBtn from '@/components/dialog/DialogConfirmBtn.vue'

export default defineComponent({
  components: {
    DialogText, DialogConfirmBtn
  },
  setup(_props, _context) {
    const state = reactive({
      server: localStorage.GAME_SERVER || '',
      valid: false,
      rules: [
        (v: string): boolean | string => (!!v) || 'Game server required'
      ]
    })

    function setGameServer(): void {
      if (state.valid) {
        localStorage.GAME_SERVER = state.server
        location.reload()
      }
    }


    return {...toRefs(state), setGameServer}
  }
})
</script>
