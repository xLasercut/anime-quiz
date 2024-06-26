<template>
  <v-data-table
    :headers="headers"
    :items="filteredSongList"
    v-model:page="currentPage"
    :items-per-page="itemsPerPage"
    :height="CLIENT_CONSTANTS.ADMIN_TABLE_HEIGHT"
    :fixed-header="true"
    :fixed-footer="true"
    density="compact"
    :no-filter="true"
  >
    <template #item.animeName="{ item }">
      <table-anime-name :song="item"></table-anime-name>
    </template>

    <template #item.action="{ item }">
      <table-action @item:edit="editSongStats(item)" @item:delete="deleteSongStats(item)"></table-action>
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
        :local-storage-key="LOCAL_STORAGE_CONSTANTS.SONG_STATS_EDIT_TABLE_ITEMS_PER_PAGE"
      ></table-pagination>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { useClientStore } from '@/plugins/store/client';
import { useDataStore } from '@/plugins/store/data';
import TableAnimeName from '@/components/common/tables/TableAnimeName.vue';
import { useAdminStore } from '@/plugins/store/admin';
import { computed, inject, ref } from 'vue';
import { CLIENT_EVENTS } from '@/assets/events';
import { TOpenDialog } from '@/assets/types';
import { CLIENT_CONSTANTS, DATABASE_EDIT_MODE, LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import { DIALOG_ROUTES } from '@/assets/routing/routes';
import { SONG_TYPES, TCombinedSongStats } from 'anime-quiz-shared-resources';
import TablePagination from '@/components/common/tables/TablePagination.vue';
import SongListEditTableFilters from '@/components/song-list-edit/SongListEditTableFilters.vue';
import { isMatchFilter } from '@/assets/game-helpers';
import TableAction from '@/components/common/tables/TableAction.vue';
import { usePagination } from '@/assets/pagination-helpers';

const clientStore = useClientStore();
const dataStore = useDataStore();
const adminStore = useAdminStore();
const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as TOpenDialog;

const { currentPage, itemsPerPage } = usePagination(LOCAL_STORAGE_CONSTANTS.SONG_STATS_EDIT_TABLE_ITEMS_PER_PAGE);
const filters = ref({
  anime: '',
  type: Object.values(SONG_TYPES),
  title: '',
  artist: ''
});

const headers = computed(() => {
  const _headers: { title: string; key: string; sortable: boolean; width?: string }[] = [
    { title: 'Anime', key: 'animeName', sortable: false },
    { title: 'Title', key: 'songTitle', sortable: false },
    { title: 'Artist', key: 'artist', sortable: false },
    { title: 'Type', key: 'type', sortable: false },
    { title: 'Play Count', key: 'playCount', sortable: true }
  ];
  if (clientStore.clientData.admin) {
    _headers.push({ title: 'Action', key: 'action', sortable: false, width: CLIENT_CONSTANTS.TABLE_ACTION_WIDTH });
  }
  return _headers;
});

const filteredSongList = computed(() => {
  const songList = [];
  for (const song of dataStore.songList) {
    if (
      song.songId in dataStore.songStatsRecords &&
      isMatchFilter(filters.value.anime, song.animeName.join(',')) &&
      isMatchFilter(filters.value.title, song.songTitle) &&
      isMatchFilter(filters.value.artist, song.artist) &&
      filters.value.type.includes(song.type)
    ) {
      songList.push({
        ...song,
        playCount: dataStore.songStatsRecords[song.songId]
      });
    }
  }
  return songList;
});

function editSongStats(song: TCombinedSongStats) {
  adminStore.updateSongStatsInEdit({
    songId: song.songId,
    playCount: song.playCount
  });
  adminStore.updateEditMode(DATABASE_EDIT_MODE.EDIT);
  openDialog(DIALOG_ROUTES.SONG_STATS_EDIT, 'Edit Song Stats');
}

function deleteSongStats(song: TCombinedSongStats) {
  adminStore.updateSongStatsInEdit({
    songId: song.songId,
    playCount: song.playCount
  });
  adminStore.updateEditMode(DATABASE_EDIT_MODE.DELETE);
  openDialog(DIALOG_ROUTES.SONG_STATS_EDIT, 'Delete Song Stats');
}
</script>
