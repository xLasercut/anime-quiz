<template>
  <v-data-table
    :height="CLIENT_CONSTANTS.SONG_LIST_EDIT_TABLE_HEIGHT"
    v-model:page="currentPage"
    density="compact"
    :items="filteredSongs()"
    :headers="headers"
    :fixed-header="true"
    :fixed-footer="true"
    :items-per-page="itemsPerPage"
    :show-select="true"
    v-model="songsSelected"
    item-value="songId"
  >
    <template #item.animeName="{ item }">
      <table-anime-name :song="item.selectable"></table-anime-name>
    </template>

    <template #item.src="{ item }">
      <a :href="item.selectable.src" target="_blank">View</a>
    </template>

    <template #top>
      <v-container :fluid="true">
        <song-list-edit-table-filters
          v-model:anime.trim="filters.anime"
          v-model:title.trim="filters.title"
        ></song-list-edit-table-filters>
      </v-container>
    </template>

    <template #bottom="{ pageCount }">
      <table-pagination
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :length="pageCount"
      ></table-pagination>
    </template>
  </v-data-table>
  {{ songsSelected }}
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useDataStore } from '@/plugins/store/data';
import { VDataTable } from 'vuetify/labs/VDataTable';
import { SongType } from '@/assets/shared/models/types';
import TableAnimeName from '@/components/common/tables/TableAnimeName.vue';
import { CLIENT_CONSTANTS } from '@/assets/constants';
import TablePagination from '@/components/common/tables/TablePagination.vue';
import SongListEditTableFilters from '@/components/song-list-edit/SongListEditTableFilters.vue';
import { isMatchFilter } from '@/assets/game-helpers';

export default defineComponent({
  components: {
    SongListEditTableFilters,
    TablePagination,
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
      ],
      currentPage: 1,
      itemsPerPage: 20,
      songsSelected: [],
      filters: {
        anime: '',
        type: '',
        title: '',
        artist: ''
      }
    });

    function filteredSongs(): SongType[] {
      return dataStore.songList.filter((song) => {
        return (
          isMatchFilter(state.filters.anime, song.animeName.join(',')) &&
          isMatchFilter(state.filters.title, song.songTitle)
        );
      });
    }

    return { ...toRefs(state), filteredSongs, CLIENT_CONSTANTS };
  }
});
</script>
