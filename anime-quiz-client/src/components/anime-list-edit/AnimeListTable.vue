<template>
  <v-data-table
    dense
    disable-sort
    fixed-header
    disable-filtering
    hide-default-footer
    :height="CLIENT_CONSTANTS.TABLE_HEIGHT"
    :headers="headers"
    :items="filteredAnimeList()"
    :items-per-page="itemsPerPage"
    :page="currentPage"
  >
    <template #top>
      <v-container fluid>
        <anime-list-table-filter
          :anime-id-filter.sync="animeIdFilter"
          :anime-name-filter.sync="animeNameFilter"
        ></anime-list-table-filter>
        <anime-list-table-actions></anime-list-table-actions>
      </v-container>
    </template>

    <template #item.anime_name="{item}">
      <v-chip small v-for="(name, index) in item.anime_name" color="primary" :key="`${item.anime_id}_${index}`">{{ name }}</v-chip>
    </template>

    <template #item.action="{item}">
      <v-icon color="warning" @click="editAnime(item)">mdi-pencil</v-icon>
      <v-icon color="error" @click="deleteAnime(item)">mdi-delete</v-icon>
    </template>

    <template #footer="{ props }">
      <table-pagination
        :current-page="props.pagination.page"
        @input="currentPage = $event"
        :length="props.pagination.pageCount"
        :items-per-page.sync="itemsPerPage"
      ></table-pagination>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, toRefs } from '@vue/composition-api'
import TablePagination from '../shared/TablePagination.vue'
import { CLIENT_CONSTANTS } from '../../assets/constants'
import AnimeListTableFilter from './AnimeListTableFilter.vue'
import { AqAnime } from '../../assets/shared/interfaces'
import { store } from '../../plugins/store'
import AnimeListTableActions from './AnimeListTableActions.vue'
import { MUTATIONS } from '../../plugins/store/mutations'
import { CLIENT_EVENTS } from '../../assets/events'
import { DIALOG_ROUTES } from '../../plugins/routing/routes'

export default defineComponent({
  components: { AnimeListTableActions, TablePagination, AnimeListTableFilter },
  setup() {
    const state = reactive({
      headers: [
        { text: 'Anime ID', value: 'anime_id' },
        { text: 'Name', value: 'anime_name' },
        { text: 'Action', value: 'action' }
      ],
      itemsPerPage: 10,
      currentPage: 0,
      animeIdFilter: '',
      animeNameFilter: ''
    })

    const openDialog = inject<Function>(CLIENT_EVENTS.OPEN_DIALOG)

    function filteredAnimeList(): AqAnime[] {
      return store.state.admin.animeList.filter((anime) => {
        return anime.anime_name.join(',').toLowerCase().includes(state.animeNameFilter.toLowerCase()) &&
          anime.anime_id.toLowerCase().includes(state.animeIdFilter.toLowerCase())
      })
    }

    function editAnime(anime: AqAnime): void {
      if (openDialog) {
        store.commit(MUTATIONS.ADMIN_UPDATE_ANIME_ID, anime.anime_id)
        store.commit(MUTATIONS.ADMIN_UPDATE_ANIME_NAME, anime.anime_name)
        openDialog(DIALOG_ROUTES.EDIT_ANIME_DIALOG, 'Edit Anime')
      }
    }

    function deleteAnime(anime: AqAnime): void {
      if (openDialog) {
        store.commit(MUTATIONS.ADMIN_UPDATE_ANIME_ID, anime.anime_id)
        store.commit(MUTATIONS.ADMIN_UPDATE_ANIME_NAME, anime.anime_name)
        openDialog(DIALOG_ROUTES.DELETE_ANIME_DIALOG, 'Delete Anime')
      }
    }

    return {
      ...toRefs(state),
      CLIENT_CONSTANTS,
      filteredAnimeList,
      editAnime,
      deleteAnime
    }
  }
})
</script>
