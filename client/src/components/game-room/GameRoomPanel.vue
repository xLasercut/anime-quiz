<template>
  <v-toolbar-items>
    <div class="volume-slider-container">
      <v-slider
        prepend-icon="mdi-volume-medium"
        hide-details
        dense
        :min="0"
        :max="100"
        :value="50"
        @change="changeVolume($event)"
      ></v-slider>
    </div>
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
    const _changeVolume = inject<Function>(CLIENT_EVENTS.CHANGE_VOLUME)

    function changeVolume(volume: number): void {
      if (_changeVolume) {
        _changeVolume(volume)
      }
    }

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
      stopGame,
      changeVolume
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
