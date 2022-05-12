<template>
  <v-data-table
    disable-sort
    fixed-header
    disable-filtering
    hide-default-footer
    :headers="headers"
    :height="CLIENT_CONSTANTS.TABLE_HEIGHT"
    :items="$store.getters.filteredSongList"
    :page="currentPage"
    :items-per-page="itemsPerPage"
  >
    <template #top>
      <song-list-table-filter></song-list-table-filter>
    </template>

    <template #item.src="{ item }">
      <a :href="item.src" target="_blank">View</a>
    </template>

    <template #footer="{ props }">
      <div class="v-data-footer">
        <div class="v-data-footer__pagination">
          <v-pagination
            v-model="currentPage"
            :length="props.pagination.pageCount"
            :total-visible="10"
          ></v-pagination>
        </div>
        <div class="v-data-footer__select">
          Rows per page:
          <v-select v-model="itemsPerPage" hide-details dense outlined :items="paginationSelectItems"></v-select>
        </div>
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { CLIENT_CONSTANTS } from '../../assets/constants'
import SongListTableFilter from './song-list-table/SongListTableFilter.vue'

export default defineComponent({
  components: { SongListTableFilter },
  setup() {
    const state = reactive({
      headers: [
        { text: 'Anime', value: 'anime_name' },
        { text: 'Title', value: 'song_title' },
        { text: 'Artist', value: 'artist' },
        { text: 'Type', value: 'type' },
        { text: 'Source', value: 'src' }
      ],
      currentPage: 1,
      itemsPerPage: 10,
      paginationSelectItems: [ 5, 10, 15, 20 ]
    })

    return {
      ...toRefs(state),
      CLIENT_CONSTANTS
    }
  }
})
</script>
