<template>
  <v-data-table
    density="compact"
    :fixed-header="true"
    :fixed-footer="true"
    :show-expand="true"
    :items="filteredSongList()"
    :headers="headers"
    v-model:page="currentPage"
    v-model:expanded="expanded"
    :items-per-page="itemsPerPage"
    :height="CLIENT_CONSTANTS.ADMIN_TABLE_HEIGHT"
    item-value="songId"
  >
    <template #item.animeName="{ item }">
      <table-anime-name :song="item"></table-anime-name>
    </template>

    <template #item.src="{ item }">
      <a :href="item.src" target="_blank">View</a>
    </template>

    <template #item.action="{ item }">
      <table-action @item:edit="editSong(item)" @item:delete="deleteSong(item)"></table-action>
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

    <template #expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">{{ item }}</td>
      </tr>
    </template>

    <template #bottom="{ pageCount }">
      <table-pagination
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :length="pageCount"
        :local-storage-key="LOCAL_STORAGE_CONSTANTS.SONG_EDIT_TABLE_ITEMS_PER_PAGE"
      ></table-pagination>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { useDataStore } from '@/plugins/store/data';
import { SongType } from '@/assets/shared/models/types';
import { CLIENT_CONSTANTS, DATABASE_EDIT_MODE, LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import TableAnimeName from '@/components/common/tables/TableAnimeName.vue';
import TablePagination from '@/components/common/tables/TablePagination.vue';
import SongListEditTableFilters from '@/components/song-list-edit/SongListEditTableFilters.vue';
import { isMatchFilter } from '@/assets/game-helpers';
import TableAction from '@/components/common/tables/TableAction.vue';
import { DIALOG_ROUTES } from '@/assets/routing/routes';
import { useAdminStore } from '@/plugins/store/admin';
import { OpenDialog } from '@/assets/types';
import { CLIENT_EVENTS } from '@/assets/events';
import { SONG_TYPES } from '@/assets/shared/song-types';

const dataStore = useDataStore();
const adminStore = useAdminStore();
const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as OpenDialog;
const headers = [
  { title: 'Anime', key: 'animeName', sortable: false },
  { title: 'Title', key: 'songTitle', sortable: false },
  { title: 'Artist', key: 'artist', sortable: false },
  { title: 'Type', key: 'type', sortable: false },
  { title: 'Source', key: 'src', sortable: false },
  { title: 'Action', key: 'action', sortable: false }
];
const currentPage = ref(1);
const itemsPerPage = ref(15);
const filters = ref({
  anime: '',
  type: Object.values(SONG_TYPES),
  title: '',
  artist: ''
});
const expanded = ref([]);

function editSong(song: SongType) {
  adminStore.updateSongInEdit(song);
  adminStore.updateEditMode(DATABASE_EDIT_MODE.EDIT);
  openDialog(DIALOG_ROUTES.SONG_EDIT, 'Edit Song');
}

function deleteSong(song: SongType) {
  adminStore.updateSongInEdit(song);
  adminStore.updateEditMode(DATABASE_EDIT_MODE.DELETE);
  openDialog(DIALOG_ROUTES.SONG_EDIT, 'Delete Song');
}

function filteredSongList(): SongType[] {
  return dataStore.songList.filter((song) => {
    return (
      isMatchFilter(filters.value.anime, song.animeName.join(',')) &&
      isMatchFilter(filters.value.title, song.songTitle) &&
      isMatchFilter(filters.value.artist, song.artist) &&
      filters.value.type.includes(song.type)
    );
  });
}
</script>
