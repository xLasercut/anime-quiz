<template>
  <v-data-table
    :height="CLIENT_CONSTANTS.GAME_SONG_PICKER_TABLE_HEIGHT"
    v-model:page="currentPage"
    :items-per-page="itemsPerPage"
    :headers="headers"
    :fixed-header="true"
    :fixed-footer="true"
    :items="filteredSongs"
    density="compact"
    :no-filter="true"
  >
    <template #item.animeName="{ item }">
      <table-anime-name :song="item"></table-anime-name>
    </template>

    <template #item.action="{ item }">
      <v-row :dense="true">
        <v-col cols="auto">
          <table-action-btn icon="mdi-playlist-music" color="success" @click="selectSongOverride(item)"></table-action-btn>
        </v-col>
      </v-row>
    </template>

    <template #top>
      <v-container :fluid="true">
        <song-list-edit-table-filters
          v-model:anime="filters.anime"
          v-model:title="filters.title"
          v-model:artist="filters.artist"
          v-model:type="filters.type"
        ></song-list-edit-table-filters>
      </v-container>
    </template>

    <template #bottom="{ pageCount }">
      <table-pagination
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :length="pageCount"
        :local-storage-key="LOCAL_STORAGE_CONSTANTS.MAIN_GAME_SONG_PICKER_ITEMS_PER_PAGE"
      ></table-pagination>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { TSong } from 'anime-quiz-shared-resources/src/models/types';
import { isMatchFilter } from '@/assets/game-helpers';
import { useDataStore } from '@/plugins/store/data';
import { computed, ref } from 'vue';
import TableAnimeName from '@/components/common/tables/TableAnimeName.vue';
import TablePagination from '@/components/common/tables/TablePagination.vue';
import SongListEditTableFilters from '@/components/song-list-edit/SongListEditTableFilters.vue';
import { CLIENT_CONSTANTS, LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import TableActionBtn from '@/components/common/buttons/TableActionBtn.vue';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources/src/events';
import { socket } from '@/plugins/socket';
import { SONG_TYPES } from 'anime-quiz-shared-resources/src/song-types';
import { usePagination } from '@/assets/pagination-helpers';

const emit = defineEmits(['dialog:close']);

const dataStore = useDataStore();

const headers = [
  { title: 'Anime', key: 'animeName', sortable: false },
  { title: 'Title', key: 'songTitle', sortable: false },
  { title: 'Artist', key: 'artist', sortable: false },
  { title: 'Type', key: 'type', sortable: false },
  { title: 'Action', key: 'action', sortable: false, width: '60px' }
];
const filters = ref({
  anime: '',
  type: Object.values(SONG_TYPES),
  title: '',
  artist: ''
});
const { currentPage, itemsPerPage } = usePagination(LOCAL_STORAGE_CONSTANTS.MAIN_GAME_SONG_PICKER_ITEMS_PER_PAGE);

const filteredSongs = computed((): TSong[] => {
  return dataStore.songList.filter((song) => {
    return (
      isMatchFilter(filters.value.anime, song.animeName.join(',')) &&
      isMatchFilter(filters.value.title, song.songTitle) &&
      isMatchFilter(filters.value.artist, song.artist) &&
      filters.value.type.includes(song.type)
    );
  });
});

function selectSongOverride(song: TSong) {
  socket.emit(SOCKET_EVENTS.ADMIN_GAME_SONG_OVERRIDE, song);
  emit('dialog:close');
}
</script>
