<template>
  <v-toolbar-items>
    <nav-btn icon="mdi-reload" @click="reload()" color="info">Reload</nav-btn>
    <nav-btn icon="mdi-backspace-reverse-outline" color="warning" @click="back()">Back</nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { store } from '../../plugins/store'
import { MUTATIONS } from '../../plugins/store/mutations'
import { ROUTES } from '../../plugins/routing/routes'
import { SHARED_EVENTS } from '../../assets/shared/events'
import { socket } from '../../plugins/socket'
import NavBtn from '../shared/buttons/NavBtn.vue'


export default defineComponent({
  components: {NavBtn},
  setup() {
    function back(): void {
      store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.LOBBY)
    }

    function reload(): void {
      socket.emit(SHARED_EVENTS.GET_SONG_LIST)
      socket.emit(SHARED_EVENTS.GET_ANIME_LIST)
    }

    return {
      back,
      reload
    }
  }
})
</script>
