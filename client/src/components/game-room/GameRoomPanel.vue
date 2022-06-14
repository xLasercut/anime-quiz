<template>
  <v-toolbar-items>
    <nav-btn
      color="primary"
      icon="mdi-playlist-music"
      v-if="$store.state.client.admin"
      @click="openSongPicker()"
      >Song
    </nav-btn>
    <panel-volume-control></panel-volume-control>
    <nav-btn color="error" icon="mdi-stop" v-if="showStopBtn()" @click="stopGame()">Stop</nav-btn>
    <nav-btn color="success" icon="mdi-play" v-if="showPlayBtn()" @click="startGame()"
      >Start</nav-btn
    >
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
import PanelVolumeControl from '../shared/PanelVolumeControl.vue'

export default defineComponent({
  components: { PanelVolumeControl, NavBtn },
  setup() {
    function back(): void {
      socket.emit(SHARED_EVENTS.LEAVE_ALL_ROOMS)
      store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.ROOM_LIST)
    }

    const openDialog = inject<Function>(CLIENT_EVENTS.OPEN_DIALOG)

    function openSettings(): void {
      if (openDialog) {
        store.commit(MUTATIONS.EDIT_DISABLE_GAME_SETTINGS, true)
        socket.emit(SHARED_EVENTS.GET_GAME_SETTINGS)
        openDialog(DIALOG_ROUTES.GAME_ROOM_SETTINGS, 'Settings')
      }
    }

    function showPlayBtn(): boolean {
      return (store.state.client.host || store.state.client.admin) && !store.state.game.playing
    }

    function showStopBtn(): boolean {
      return (store.state.client.host || store.state.client.admin) && store.state.game.playing
    }

    function startGame(): void {
      socket.emit(SHARED_EVENTS.START_GAME)
    }

    function stopGame(): void {
      socket.emit(SHARED_EVENTS.STOP_GAME)
    }

    function openSongPicker(): void {
      if (openDialog) {
        openDialog(DIALOG_ROUTES.GAME_ROOM_SONG_PICKER, 'Song Picker')
      }
    }

    return {
      back,
      openSettings,
      startGame,
      stopGame,
      showPlayBtn,
      showStopBtn,
      openSongPicker
    }
  }
})
</script>

<style scoped>
.volume-slider-container {
  width: 150px;
  padding-top: 5px;
}
</style>
