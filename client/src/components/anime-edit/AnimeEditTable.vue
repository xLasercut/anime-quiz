<template>
  <v-data-table
    density="compact"
    :fixed-header="true"
    :fixed-footer="true"
    :items="filteredAnimeList"
    :headers="headers"
    v-model:page="currentPage"
    :items-per-page="itemsPerPage"
    :height="CLIENT_CONSTANTS.ADMIN_TABLE_HEIGHT"
    :no-filter="true"
  >
    <template #item.animeName="{ item }">
      <v-row :dense="true">
        <v-col v-for="name in item.animeName" cols="auto">
          <v-chip color="primary" size="small" :label="true">{{ name }}</v-chip>
        </v-col>
      </v-row>
    </template>

    <template #item.action="{ item }">
      <table-action @item:edit="editAnime(item)" @item:delete="deleteAnime(item)"></table-action>
    </template>

    <template #top>
      <v-container :fluid="true">
        <anime-edit-table-filters
          v-model:anime-id.trim="filters.animeId"
          v-model:anime-name.trim="filters.animeName"
        ></anime-edit-table-filters>
      </v-container>
    </template>

    <template #bottom="{ pageCount }">
      <table-pagination
        v-model:current-page="currentPage"
        v-model:items-per-page="itemsPerPage"
        :length="pageCount"
        :local-storage-key="LOCAL_STORAGE_CONSTANTS.ANIME_EDIT_TABLE_ITEMS_PER_PAGE"
      ></table-pagination>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { useDataStore } from '@/plugins/store/data';
import { TAnime } from 'anime-quiz-shared-resources';
import { useAdminStore } from '@/plugins/store/admin';
import TablePagination from '@/components/common/tables/TablePagination.vue';
import { CLIENT_CONSTANTS, DATABASE_EDIT_MODE, LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import AnimeEditTableFilters from '@/components/anime-edit/AnimeEditTableFilters.vue';
import { isMatchFilter } from '@/assets/game-helpers';
import { TOpenDialog } from '@/assets/types';
import { CLIENT_EVENTS } from '@/assets/events';
import { DIALOG_ROUTES } from '@/assets/routing/routes';
import TableAction from '@/components/common/tables/TableAction.vue';
import { usePagination } from '@/assets/pagination-helpers';

const dataStore = useDataStore();
const adminStore = useAdminStore();
const openDialog = inject(CLIENT_EVENTS.OPEN_DIALOG) as TOpenDialog;
const headers = [
  { title: 'Anime ID', key: 'animeId', sortable: false },
  { title: 'Anime Names', key: 'animeName', sortable: false },
  { title: 'Action', key: 'action', sortable: false, width: CLIENT_CONSTANTS.TABLE_ACTION_WIDTH }
];
const filters = ref({
  animeId: '',
  animeName: ''
});
const { currentPage, itemsPerPage } = usePagination(LOCAL_STORAGE_CONSTANTS.ANIME_EDIT_TABLE_ITEMS_PER_PAGE);

const filteredAnimeList = computed((): TAnime[] => {
  return dataStore.animeList.filter((anime) => {
    return anime.animeId.includes(filters.value.animeId) && isMatchFilter(filters.value.animeName, anime.animeName.join(','));
  });
});

function editAnime(anime: TAnime) {
  adminStore.updateAnimeInEdit(anime);
  adminStore.updateEditMode(DATABASE_EDIT_MODE.EDIT);
  openDialog(DIALOG_ROUTES.ANIME_EDIT, 'Edit Anime');
}

function deleteAnime(anime: TAnime) {
  adminStore.updateAnimeInEdit(anime);
  adminStore.updateEditMode(DATABASE_EDIT_MODE.DELETE);
  openDialog(DIALOG_ROUTES.ANIME_EDIT, 'Delete Anime');
}
</script>
