<template>
  <v-row :dense="true">
    <v-col cols="12">
      <v-data-table :show-expand="true" :headers="headers" :items="[gameStore.currentSong]" density="compact">
        <template #item.animeName="{ item }">
          <table-anime-name :song="item"></table-anime-name>
        </template>

        <template #item.src="{ item }">
          <a :href="item.src" target="_blank">View</a>
        </template>

        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">{{ item }}</td>
          </tr>
        </template>

        <template #bottom></template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useGameStore } from '@/plugins/store/game';
import TableAnimeName from '@/components/common/tables/TableAnimeName.vue';

const gameStore = useGameStore();
const headers = [
  { title: 'Anime', key: 'animeName', sortable: false },
  { title: 'Title', key: 'songTitle', sortable: false },
  { title: 'Artist', key: 'artist', sortable: false },
  { title: 'Type', key: 'type', sortable: false },
  { title: 'Source', key: 'src', sortable: false }
];
</script>
