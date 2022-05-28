<template>
  <v-main>
    <v-row>
      <v-col>
        <lobby-menu-card
          color="success"
          title="Game Room"
          description="Play anime music quiz"
          @click="openRoomList()"
        ></lobby-menu-card>
      </v-col>
      <v-col>
        <lobby-menu-card
          color="primary"
          title="Song List"
          description="Add/Remove songs from your song list"
          @click="openSongList()"
        ></lobby-menu-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import { MUTATIONS } from '../plugins/store/mutations'
import { ROUTES } from '../plugins/routing/routes'
import { defineComponent, onMounted } from '@vue/composition-api'
import { store } from '../plugins/store'
import LobbyMenuCard from '../components/lobby/LobbyMenuCard.vue'
import { socket } from '../plugins/socket'
import { SHARED_EVENTS } from '../assets/shared/events'

export default defineComponent({
  components: { LobbyMenuCard },
  setup() {
    function openSongList() {
      socket.emit(SHARED_EVENTS.JOIN_SONG_LIST)
      store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.SONG_LIST)
    }

    function openRoomList() {
      store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.ROOM_LIST)
    }

    onMounted(() => {
      socket.emit(SHARED_EVENTS.LEAVE_ALL_ROOMS)
      store.commit(MUTATIONS.RESET_STORE_STATE)
    })

    return {
      openSongList,
      openRoomList
    }
  }
})
</script>
