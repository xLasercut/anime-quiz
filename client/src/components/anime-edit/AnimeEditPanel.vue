<template>
  <v-toolbar-items>
    <nav-btn icon="mdi-plus" color="success" @click="newAnime()">New Anime</nav-btn>
    <nav-btn icon="mdi-refresh" color="info" @click="reload()">Reload</nav-btn>
    <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import { defineComponent, inject } from '@vue/composition-api'
import { store } from '../../plugins/store'
import { MUTATIONS } from '../../plugins/store/mutations'
import { DIALOG_ROUTES, ROUTES } from '../../plugins/routing/routes'
import NavBtn from '../shared/buttons/NavBtn.vue'
import { socket } from '../../plugins/socket'
import { SHARED_EVENTS } from 'anime-quiz-server/src/shared/events'
import { CLIENT_EVENTS } from '../../assets/events'

export default defineComponent({
  components: { NavBtn },
  setup() {
    function back(): void {
      store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.LOBBY)
    }

    function reload(): void {
      store.commit(MUTATIONS.SOCKET_UPDATE_ANIME_LIST, [])
      socket.emit(SHARED_EVENTS.GET_ANIME_LIST)
    }

    const openDialog = inject<Function>(CLIENT_EVENTS.OPEN_DIALOG)

    function newAnime(): void {
      if (openDialog) {
        store.commit(MUTATIONS.ADMIN_UPDATE_ANIME_ID, '')
        store.commit(MUTATIONS.ADMIN_UPDATE_ANIME_NAME, [])
        openDialog(DIALOG_ROUTES.NEW_ANIME_DIALOG, 'New Anime')
      }
    }

    return {
      back,
      reload,
      newAnime
    }
  }
})
</script>
