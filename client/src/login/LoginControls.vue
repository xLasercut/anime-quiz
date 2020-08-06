<template>
  <div>
    <v-toolbar-items>
      <nav-btn color="success" icon="mdi-gamepad-variant" @click="changeLogin('game')"></nav-btn>
      <nav-btn color="primary" icon="mdi-playlist-music" @click="changeLogin('list')"></nav-btn>
      <nav-btn color="warning" icon="mdi-sticker-emoji" @click="changeLogin('misc')"></nav-btn>
      <nav-btn color="info" icon="mdi-cog" @click="showClientSettings()"></nav-btn>
    </v-toolbar-items>
    <game-dialog
      label="Client Settings"
      v-model="show"
    >
      <v-form v-model="valid" @submit.prevent="setGamerServer()">
        <v-row justify="center">
          <dialog-text label="Game Server" v-model.trim="gameServer" :rules="rules"></dialog-text>
          <dialog-confirm-btn :disabled="!valid"></dialog-confirm-btn>
        </v-row>
      </v-form>
    </game-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs} from '@vue/composition-api'
  import NavBtn from '../components/buttons/NavBtn.vue'
  import {ILoginMode} from '@/assets/types'
import {EventBus} from '@/assets/events'
import GameDialog from '@/components/GameDialog.vue'
import DialogText from '@/components/dialog/DialogText.vue'
import DialogConfirmBtn from '@/components/dialog/DialogConfirmBtn.vue'

  export default defineComponent({
    components: {
      NavBtn, GameDialog, DialogText, DialogConfirmBtn
    },
    setup(_props, context) {
      const state = reactive({
        show: false,
        gameServer: localStorage.GAME_SERVER || '',
        valid: false,
        rules: [
          (v: string): boolean | string => (!!v) || 'Game server required'
        ]
      })

      function changeLogin(mode: ILoginMode): void {
        context.root.$store.commit('CHANGE_LOGIN_MODE', mode)
      }

      function setGamerServer(): void {
        if (state.show && state.valid) {
          localStorage.GAME_SERVER = state.gameServer
          location.reload()
        }
      }

      function showClientSettings(): void {
        state.gameServer = localStorage.GAME_SERVER || ''
        state.show = true
      }

      onMounted(() => {
        if (!localStorage.GAME_SERVER) {
          EventBus.$emit('SYSTEM_NOTIFICATION', 'error', 'Game server not set. Please set the game server and reload the browser')
        }
      })

      return {changeLogin, ...toRefs(state), setGamerServer, showClientSettings}
    }
  })
</script>
