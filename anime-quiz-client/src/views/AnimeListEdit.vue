<template>
  <v-main>
    <v-card flat>
      <anime-list-table></anime-list-table>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { socket } from '../plugins/socket'
import { SHARED_EVENTS } from '../assets/shared/events'
import AnimeListTable from '../components/anime-list-edit/AnimeListTable.vue'

export default defineComponent({
  components: { AnimeListTable },
  setup() {
    socket.emit(SHARED_EVENTS.JOIN_ANIME_LIST_EDIT)
  }
})
</script>
