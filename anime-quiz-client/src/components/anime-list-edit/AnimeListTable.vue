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
      </v-container>
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
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import TablePagination from '../shared/TablePagination.vue'
import { CLIENT_CONSTANTS } from '../../assets/constants'
import AnimeListTableFilter from './AnimeListTableFilter.vue'
import { AqAnime } from '../../assets/shared/interfaces'
import { store } from '../../plugins/store'

export default defineComponent({
  components: { TablePagination, AnimeListTableFilter },
  setup() {
    const state = reactive({
      headers: [
        { text: 'Anime ID', value: 'anime_id' },
        { text: 'Name', value: 'anime_name' },
        { text: 'Action' }
      ],
      itemsPerPage: 10,
      currentPage: 0,
      animeIdFilter: '',
      animeNameFilter: ''
    })

    function filteredAnimeList(): AqAnime[] {
      return store.state.admin.animeList.filter((anime) => {
        return anime.anime_name.join(',').toLowerCase().includes(state.animeNameFilter.toLowerCase()) &&
        anime.anime_id.toLowerCase().includes(state.animeIdFilter.toLowerCase())
      })
    }

    return {
      ...toRefs(state),
      CLIENT_CONSTANTS,
      filteredAnimeList
    }
  }
})
</script>
