<template>
  <v-data-table
    density="compact"
    :fixed-header="true"
    :fixed-footer="true"
    :items="filteredAnimeList()"
    :headers="headers"
    v-model:page="currentPage"
    :items-per-page="itemsPerPage"
    :height="CLIENT_CONSTANTS.ADMIN_TABLE_HEIGHT"
  >
    <template #item.animeName="{ item }">
      <v-row :dense="true">
        <v-col v-for="name in item.raw.animeName" cols="auto">
          <v-chip color="primary" size="small" :label="true">{{ name }}</v-chip>
        </v-col>
      </v-row>
    </template>

    <template #item.action="{ item }">
      <v-row :dense="true">
        <v-col cols="auto">
          <table-action-btn icon="mdi-pencil" color="warning" @click="editAnime(item.raw)"></table-action-btn>
        </v-col>
        <v-col cols="auto">
          <table-action-btn icon="mdi-delete" color="error" @click="deleteAnime(item.raw)"></table-action-btn>
        </v-col>
      </v-row>
    </template>

    <template #top>
      <v-container :fluid="true">
        <anime-edit-table-filters v-model:anime-id.trim="filters.animeId" v-model:anime-name.trim="filters.animeName"></anime-edit-table-filters>
      </v-container>
    </template>

    <template #bottom="{ pageCount }">
      <table-pagination v-model:current-page="currentPage" v-model:items-per-page="itemsPerPage" :length="pageCount"></table-pagination>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useDataStore } from '@/plugins/store/data';
import { AnimeType } from '@/assets/shared/models/types';
import { useAdminStore } from '@/plugins/store/admin';
import TablePagination from '@/components/common/tables/TablePagination.vue';
import { CLIENT_CONSTANTS, DATABASE_EDIT_MODE } from '@/assets/constants';
import AnimeEditTableFilters from '@/components/anime-edit/AnimeEditTableFilters.vue';
import { injectStrict, isMatchFilter } from '@/assets/game-helpers';
import TableActionBtn from '@/components/common/buttons/TableActionBtn.vue';
import { OpenDialog } from '@/assets/types';
import { CLIENT_EVENTS } from '@/assets/events';
import { DIALOG_ROUTES } from '@/assets/routing/routes';

export default defineComponent({
  components: { TableActionBtn, AnimeEditTableFilters, TablePagination },
  setup() {
    const dataStore = useDataStore();
    const adminStore = useAdminStore();
    const openDialog = injectStrict<OpenDialog>(CLIENT_EVENTS.OPEN_DIALOG);

    const state = reactive({
      headers: [
        { title: 'Anime ID', key: 'animeId', sortable: false },
        { title: 'Anime Names', key: 'animeName', sortable: false },
        { title: 'Action', key: 'action', sortable: false }
      ],
      filters: {
        animeId: '',
        animeName: ''
      },
      currentPage: 1,
      itemsPerPage: 15
    });

    function filteredAnimeList(): AnimeType[] {
      return dataStore.animeList.filter((anime) => {
        return anime.animeId.includes(state.filters.animeId) && isMatchFilter(state.filters.animeName, anime.animeName.join(','));
      });
    }

    function editAnime(anime: AnimeType) {
      adminStore.updateAnimeInEdit(anime);
      adminStore.updateEditMode(DATABASE_EDIT_MODE.EDIT);
      openDialog(DIALOG_ROUTES.ANIME_EDIT, 'Edit Anime');
    }

    function deleteAnime(anime: AnimeType) {
      adminStore.updateAnimeInEdit(anime);
      adminStore.updateEditMode(DATABASE_EDIT_MODE.DELETE);
      openDialog(DIALOG_ROUTES.ANIME_EDIT, 'Delete Anime');
    }

    return { filteredAnimeList, ...toRefs(state), CLIENT_CONSTANTS, editAnime, deleteAnime };
  }
});
</script>
