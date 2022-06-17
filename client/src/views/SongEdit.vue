<template>
  <v-main>
    <v-card flat>
      <song-edit-table></song-edit-table>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { socket } from '../plugins/socket';
import { SHARED_EVENTS } from '../assets/shared/events';
import SongEditTable from '../components/song-edit/SongEditTable.vue';

export default defineComponent({
  components: { SongEditTable },
  setup() {
    socket.emit(SHARED_EVENTS.JOIN_SONG_EDIT);
  }
});
</script>
