<template>
  <v-data-table :items="filteredSongs()" :headers="headers">
    <template #item.animeName="{ item }">
      <table-anime-name :song="item.selectable"></table-anime-name>
    </template>

    <template #item.src="{ item }">
      <a :href="item.selectable.src" target="_blank">View</a>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useDataStore } from '@/plugins/store/data';
import { VDataTable } from 'vuetify/labs/VDataTable';
import { SongType } from '@/assets/shared/models/types';
import TableAnimeName from '@/components/common/TableAnimeName.vue';

export default defineComponent({
  components: {
    TableAnimeName,
    VDataTable
  },
  setup() {
    const dataStore = useDataStore();
    const state = reactive({
      headers: [
        { title: 'Anime', key: 'animeName', sortable: false },
        { title: 'Title', key: 'songTitle', sortable: false },
        { title: 'Artist', key: 'artist', sortable: false },
        { title: 'Type', key: 'type', sortable: false },
        { title: 'Source', key: 'src', sortable: false }
      ]
    });

    function filteredSongs(): SongType[] {
      return dataStore.songList;
    }

    return { ...toRefs(state), filteredSongs };
  }
});
</script>
