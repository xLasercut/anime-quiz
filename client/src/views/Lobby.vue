<template>
  <v-main>
    <v-row justify="center">
      <v-col v-for="card of cards" :key="card.route" v-if="showCard(card.requireAdmin)" cols="4">
        <lobby-menu-card
          :icon="card.icon"
          :color="card.color"
          :title="card.title"
          :description="card.description"
          @click="changeView(card.route)"
        ></lobby-menu-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import { MUTATIONS } from '../plugins/store/mutations'
import { ROUTES } from '../plugins/routing/routes'
import { defineComponent, onMounted, reactive, toRefs } from '@vue/composition-api'
import { store } from '../plugins/store'
import LobbyMenuCard from '../components/lobby/LobbyMenuCard.vue'
import { socket } from '../plugins/socket'
import { SHARED_EVENTS } from '../assets/shared/events'

export default defineComponent({
  components: { LobbyMenuCard },
  setup() {
    const state = reactive({
      cards: [
        {
          color: 'success',
          title: 'Game Room',
          description: 'Play anime music quiz',
          route: ROUTES.ROOM_LIST,
          requireAdmin: false,
          icon: 'mdi-gamepad-variant'
        },
        {
          color: 'primary',
          title: 'Song List',
          description: 'Add/Remove songs from your song list',
          route: ROUTES.SONG_LIST,
          requireAdmin: false,
          icon: 'mdi-playlist-music'
        },
        {
          color: 'error',
          title: 'Anime Edit',
          description: 'Edit Anime List',
          route: ROUTES.ANIME_EDIT,
          requireAdmin: true,
          icon: 'mdi-database-edit'
        },
        {
          color: 'error',
          title: 'Song Edit',
          description: 'Edit Song List',
          route: ROUTES.SONG_EDIT,
          requireAdmin: true,
          icon: 'mdi-database-edit'
        }
      ]
    })

    function changeView(route: string): void {
      store.commit(MUTATIONS.CHANGE_VIEW, route)
    }

    function showCard(requireAdmin: boolean): boolean {
      if (!requireAdmin) {
        return true
      }

      return !!store.state.client.admin
    }

    onMounted(() => {
      socket.emit(SHARED_EVENTS.LEAVE_ALL_ROOMS)
      store.commit(MUTATIONS.RESET_STORE_STATE)
    })

    return {
      changeView,
      ...toRefs(state),
      showCard
    }
  }
})
</script>
