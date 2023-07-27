<template>
  <v-main>
    <v-card :flat="true">
      <song-list-edit-table></song-list-edit-table>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SongListEditTable from '@/components/song-list-edit/SongListEditTable.vue';

export default defineComponent({
  components: { SongListEditTable }
});
</script>
