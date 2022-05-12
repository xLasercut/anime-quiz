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

export default defineComponent({
  components: { SongListTable }
})
</script>
