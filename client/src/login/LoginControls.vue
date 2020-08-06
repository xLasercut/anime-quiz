<template>
  <v-toolbar-items>
    <nav-btn color="success" icon="mdi-gamepad-variant" @click="changeLogin('game')"></nav-btn>
    <nav-btn color="primary" icon="mdi-playlist-music" @click="changeLogin('list')"></nav-btn>
    <nav-btn color="warning" icon="mdi-sticker-emoji" @click="changeLogin('misc')"></nav-btn>
    <nav-btn color="info" icon="mdi-cog" @click="showClientSettings()"></nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import {defineComponent, onMounted} from '@vue/composition-api'
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
    function changeLogin(mode: ILoginMode): void {
      context.root.$store.commit('CHANGE_LOGIN_MODE', mode)
    }

    function showClientSettings(): void {
      EventBus.$emit('GLOBAL_DIALOG', 'clientSettings', 'Client Settings')
    }

    onMounted(() => {
      if (!localStorage.GAME_SERVER) {
        EventBus.$emit('SYSTEM_NOTIFICATION', 'error', 'Game server not set. Please set the game server and reload the browser')
      }
    })

    return {changeLogin, showClientSettings}
  }
})
</script>
