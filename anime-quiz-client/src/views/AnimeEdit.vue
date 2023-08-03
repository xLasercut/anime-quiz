<template>
  <v-card variant="flat">
    <anime-edit-table></anime-edit-table>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AnimeEditTable from '@/components/anime-edit/AnimeEditTable.vue';

export default defineComponent({
  components: { AnimeEditTable }
});
</script>
