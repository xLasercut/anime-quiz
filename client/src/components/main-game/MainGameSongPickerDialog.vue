<template>
  <v-data-table
    :height="CLIENT_CONSTANTS.GAME_SONG_PICKER_TABLE_HEIGHT"
    v-model:page="currentPage"
    :items-per-page="itemsPerPage"
    :headers="headers"
    :fixed-header="true"
    :fixed-footer="true"
    :items="filteredSongs()"
    density="compact"
  >
    <template #item.animeName="{ item }">
      <table-anime-name :song="item"></table-anime-name>
    </template>

    <template #item.src="{ item }">
      <a :href="item.src" target="_blank">View</a>
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
          v-model:anime.trim="filters.anime"
          v-model:title.trim="filters.title"
          v-model:artist.trim="filters.artist"
          v-model:type.trim="filters.type"
        ></song-list-edit-table-filters>
      </v-container>
    </template>

    <template #bottom="{ pageCount }">
      <table-pagination v-model:current-page="currentPage" v-model:items-per-page="itemsPerPage" :length="pageCount"></table-pagination>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { SongType } from '@/assets/shared/models/types';
import { isMatchFilter } from '@/assets/game-helpers';
import { useDataStore } from '@/plugins/store/data';
import { ref } from 'vue';
import TableAnimeName from '@/components/common/tables/TableAnimeName.vue';
import TablePagination from '@/components/common/tables/TablePagination.vue';
import SongListEditTableFilters from '@/components/song-list-edit/SongListEditTableFilters.vue';
import { CLIENT_CONSTANTS } from '@/assets/constants';
import TableActionBtn from '@/components/common/buttons/TableActionBtn.vue';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { socket } from '@/plugins/socket';

const emit = defineEmits(['dialog:close']);

const dataStore = useDataStore();

const headers = [
  { title: 'Anime', key: 'animeName', sortable: false },
  { title: 'Title', key: 'songTitle', sortable: false },
  { title: 'Artist', key: 'artist', sortable: false },
  { title: 'Type', key: 'type', sortable: false },
  { title: 'Source', key: 'src', sortable: false },
  { title: 'Action', key: 'action', sortable: false }
];
const filters = ref({
  anime: '',
  type: '',
  title: '',
  artist: ''
});
const currentPage = ref(1);
const itemsPerPage = ref(10);

function filteredSongs(): SongType[] {
  return dataStore.songList.filter((song) => {
    return (
      isMatchFilter(filters.value.anime, song.animeName.join(',')) &&
      isMatchFilter(filters.value.title, song.songTitle) &&
      isMatchFilter(filters.value.artist, song.artist) &&
      isMatchFilter(filters.value.type, song.type)
    );
  });
}

function selectSongOverride(song: SongType) {
  socket.emit(SOCKET_EVENTS.ADMIN_GAME_SONG_OVERRIDE, song);
  emit('dialog:close');
}
</script>
