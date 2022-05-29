<template>
  <v-data-table
    dense
    disable-sort
    fixed-header
    disable-filtering
    hide-default-footer
    :height="CLIENT_CONSTANTS.TABLE_HEIGHT"
    :headers="headers"
    :items="$store.state.songList.animeList"
    :items-per-page="itemsPerPage"
    :page="currentPage"
  >
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

export default defineComponent({
  components: { TablePagination },
  setup() {
    const state = reactive({
      headers: [
        { text: 'Anime ID', value: 'anime_id' },
        { text: 'Name', value: 'anime_name' }
      ],
      itemsPerPage: 10,
      currentPage: 0
    })

    return {
      ...toRefs(state),
      CLIENT_CONSTANTS
    }
  }
})
</script>
