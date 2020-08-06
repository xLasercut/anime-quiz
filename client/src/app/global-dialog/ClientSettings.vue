<template>
  <v-form v-model="valid" @submit.prevent="setGamerServer()">
    <v-row justify="center">
      <dialog-text v-model.trim="gameServer" label="Game Server" :rules="rules"></dialog-text>
      <dialog-confirm-btn :disabled="!valid"></dialog-confirm-btn>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from '@vue/composition-api'
import DialogText from '../../components/dialog/DialogText.vue'
import DialogConfirmBtn from '../../components/dialog/DialogConfirmBtn.vue'

export default defineComponent({
  components: {
    DialogText, DialogConfirmBtn
  },
  setup(_props, _context) {
    const state = reactive({
      show: false,
      gameServer: localStorage.GAME_SERVER || '',
      valid: false,
      rules: [
        (v: string): boolean | string => (!!v) || 'Game server required'
      ]
    })

    function setGamerServer(): void {
      if (state.valid) {
        localStorage.GAME_SERVER = state.gameServer
        location.reload()
      }
    }


    return {...toRefs(state), setGamerServer}
  }
})
</script>
