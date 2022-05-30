<template>
  <v-main>
    <v-card flat>
      <anime-edit-table></anime-edit-table>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { socket } from '../plugins/socket'
import { SHARED_EVENTS } from '../assets/shared/events'
import AnimeEditTable from '../components/anime-edit/AnimeEditTable.vue'

export default defineComponent({
  components: { AnimeEditTable },
  setup() {
    socket.emit(SHARED_EVENTS.JOIN_ANIME_EDIT)
  }
})
</script>
