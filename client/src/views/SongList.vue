<template>
  <v-main>
    <v-card flat>
      <song-list-table></song-list-table>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import SongListTable from '../components/song-list/SongListTable.vue'
import { socket } from '../plugins/socket'
import { SHARED_EVENTS } from '../assets/shared/events'

export default defineComponent({
  components: { SongListTable },
  setup() {
    socket.emit(SHARED_EVENTS.JOIN_SONG_LIST)
  }
})
</script>
