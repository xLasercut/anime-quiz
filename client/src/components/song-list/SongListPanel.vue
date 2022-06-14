<template>
  <v-toolbar-items>
    <nav-btn icon="mdi-refresh" color="info" @click="reload()">Reload</nav-btn>
    <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { store } from '../../plugins/store'
import { MUTATIONS } from '../../plugins/store/mutations'
import { ROUTES } from '../../plugins/routing/routes'
import NavBtn from '../shared/buttons/NavBtn.vue'
import { socket } from '../../plugins/socket'
import { SHARED_EVENTS } from 'anime-quiz-server/src/shared/events'
import { SONG_LIST_EDIT_MODE } from '../../assets/shared/constants'

export default defineComponent({
  components: { NavBtn },
  setup() {
    function back(): void {
      store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.LOBBY)
    }

    function reload(): void {
      store.commit(MUTATIONS.SOCKET_UPDATE_SONG_LIST, [])
      socket.emit(SHARED_EVENTS.GET_SONG_LIST)
      socket.emit(SHARED_EVENTS.GET_ANIME_LIST)
      socket.emit(SHARED_EVENTS.GET_SONG_TITLE_LIST)
      socket.emit(SHARED_EVENTS.GET_USER_LISTS)
    }

    return {
      back,
      reload
    }
  }
})
</script>
