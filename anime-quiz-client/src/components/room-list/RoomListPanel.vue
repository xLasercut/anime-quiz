<template>
  <v-toolbar-items>
    <nav-btn color="success" icon="mdi-plus" @click="newRoom()">New Room</nav-btn>
    <nav-btn color="info" icon="mdi-refresh" @click="reload()">Reload</nav-btn>
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
      store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.LOBBY)
    }

    function reload(): void {
      socket.emit(SHARED_EVENTS.GET_ROOM_LIST)
    }

    const openDialog = inject<Function>(CLIENT_EVENTS.OPEN_DIALOG)

    function newRoom(): void {
      if (openDialog) {
        openDialog(DIALOG_ROUTES.NEW_ROOM, 'New Room')
      }
    }

    return {
      back,
      reload,
      newRoom
    }
  }
})
</script>
