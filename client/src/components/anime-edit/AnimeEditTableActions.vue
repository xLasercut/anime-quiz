<template>
  <v-row dense justify="center">
    <v-col cols="auto">
      <icon-btn
        icon="mdi-plus"
        color="success"
        @click="newAnime()"
      >
        New Anime
      </icon-btn>
    </v-col>
    <v-col cols="auto">
      <icon-btn color="info" @click="reload()" icon="mdi-refresh">Reload</icon-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, inject } from '@vue/composition-api'
import IconBtn from '../shared/buttons/IconBtn.vue'
import { store } from '../../plugins/store'
import { MUTATIONS } from '../../plugins/store/mutations'
import { socket } from '../../plugins/socket'
import { SHARED_EVENTS } from '../../assets/shared/events'
import { CLIENT_EVENTS } from '../../assets/events'
import { DIALOG_ROUTES } from '../../plugins/routing/routes'

export default defineComponent({
  components: { IconBtn },
  setup() {
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
      reload,
      newAnime
    }
  }
})
</script>
