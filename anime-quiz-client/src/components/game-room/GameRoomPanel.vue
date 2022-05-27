<template>
  <v-toolbar-items>
    <nav-btn v-if="$store.state.client.admin" icon="mdi-shield">Admin</nav-btn>
    <nav-btn color="error" icon="mdi-stop" v-if="$store.state.game.playing" @click="stopGame()">Stop</nav-btn>
    <nav-btn color="success" icon="mdi-play" v-else @click="startGame()">Start</nav-btn>
    <nav-btn color="info" icon="mdi-cog" @click="openSettings()">Settings</nav-btn>
    <nav-btn color="warning" icon="mdi-backspace-reverse-outline" @click="back()">Back</nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import { defineComponent, inject } from '@vue/composition-api'
import NavBtn from '../shared/buttons/NavBtn.vue'
import { store } from '../../plugins/store'
import { MUTATIONS } from '../../plugins/store/mutations'
import { DIALOG_ROUTES, ROUTES } from '../../plugins/routing/routes'
import { socket } from '../../plugins/socket'
import { SHARED_EVENTS } from '../../assets/shared/events'
import { CLIENT_EVENTS } from '../../assets/events'

export default defineComponent({
  components: { NavBtn },
  setup() {
    function back(): void {
      socket.emit(SHARED_EVENTS.LEAVE_ALL_ROOMS)
      store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.ROOM_LIST)
    }

    const openDialog = inject<Function>(CLIENT_EVENTS.OPEN_DIALOG)

    function openSettings(): void {
      if (openDialog) {
        socket.emit(SHARED_EVENTS.RELOAD_SONG_LIST_DATA)
        socket.emit(SHARED_EVENTS.GET_GAME_SETTINGS)
        openDialog(DIALOG_ROUTES.GAME_ROOM_SETTINGS, 'Settings')
      }
    }

    function startGame(): void {
      socket.emit(SHARED_EVENTS.START_GAME)
    }

    function stopGame(): void {
      socket.emit(SHARED_EVENTS.STOP_GAME)
    }

    return {
      back,
      openSettings,
      startGame,
      stopGame
    }
  }
})
</script>
