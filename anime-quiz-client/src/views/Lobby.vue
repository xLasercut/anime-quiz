<template>
  <v-main>
    <v-row>
      <v-col>
        <lobby-menu-card color="success" title="Game Room" description="Play anime music quiz"></lobby-menu-card>
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
import { defineComponent } from '@vue/composition-api'
import { store } from '../plugins/store'
import LobbyMenuCard from '../components/lobby/LobbyMenuCard.vue'

export default defineComponent({
  components: {LobbyMenuCard},
  setup() {
    function openSongList() {
      store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.SONG_LIST)
    }

    return {
      openSongList
    }
  }
})


</script>
