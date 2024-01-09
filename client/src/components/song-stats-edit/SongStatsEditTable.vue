<template>
  <v-data-table
    :headers="headers()"
    :items="filteredSongList()"
    v-model:page="currentPage"
    :items-per-page="itemsPerPage"
    :height="CLIENT_CONSTANTS.ADMIN_TABLE_HEIGHT"
    :fixed-header="true"
    :fixed-footer="true"
    density="compact"
  >
    <template #item.animeName="{ item }">
      <table-anime-name :song="item"></table-anime-name>
    </template>

    <template #item.action="{ item }">
      <table-action-btn icon="mdi-pencil" color="warning" @click="editSongStats(item)"></table-action-btn>
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
import { useClientStore } from '@/plugins/store/client';
import { useDataStore } from '@/plugins/store/data';
import TableAnimeName from '@/components/common/tables/TableAnimeName.vue';
import TableActionBtn from '@/components/common/buttons/TableActionBtn.vue';
import { useAdminStore } from '@/plugins/store/admin';
import { inject, ref } from 'vue';
import { CLIENT_EVENTS } from '@/assets/events';
import { OpenDialog } from '@/assets/types';
import { CLIENT_CONSTANTS, DATABASE_EDIT_MODE } from '@/assets/constants';
import { DIALOG_ROUTES } from '@/assets/routing/routes';
import { CombinedSongStatsType } from '@/assets/shared/models/types';
import TablePagination from '@/components/common/tables/TablePagination.vue';
import { SONG_TYPES } from '@/assets/shared/song-types';
import SongListEditTableFilters from '@/components/song-list-edit/SongListEditTableFilters.vue';
import { isMatchFilter } from '@/assets/game-helpers';
import { storeToRefs } from 'pinia';

const clientStore = useClientStore();
const dataStore = useDataStore();
const adminStore = useAdminStore();
const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as OpenDialog;
const { getSongStats } = storeToRefs(dataStore);

const currentPage = ref(1);
const itemsPerPage = ref(15);
const filters = ref({
  anime: '',
  type: Object.values(SONG_TYPES),
  title: '',
  artist: ''
});

function headers() {
  const _headers = [
    { title: 'Anime', key: 'animeName', sortable: false },
    { title: 'Title', key: 'songTitle', sortable: false },
    { title: 'Artist', key: 'artist', sortable: false },
    { title: 'Type', key: 'type', sortable: false },
    { title: 'Play Count', key: 'playCount', sortable: false }
  ];
  if (clientStore.clientData.admin) {
    _headers.push({ title: 'Action', key: 'action', sortable: false });
  }
  return _headers;
}

function filteredSongList(): CombinedSongStatsType[] {
  const songList = [];
  for (const song of dataStore.songList) {
    const songStats = getSongStats.value(song);
    if (songStats) {
      songList.push({
        ...song,
        playCount: songStats.playCount
      });
    }
  }

  return songList.filter((song) => {
    return (
      isMatchFilter(filters.value.anime, song.animeName.join(',')) &&
      isMatchFilter(filters.value.title, song.songTitle) &&
      isMatchFilter(filters.value.artist, song.artist) &&
      filters.value.type.includes(song.type)
    );
  });
}

function editSongStats(song: CombinedSongStatsType) {
  adminStore.updateSongStatsInEdit({
    songId: song.songId,
    playCount: song.playCount
  });
  adminStore.updateEditMode(DATABASE_EDIT_MODE.EDIT);
  openDialog(DIALOG_ROUTES.SONG_STATS_EDIT, 'Edit Song Stats');
}
</script>
