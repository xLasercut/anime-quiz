<template>
  <song-list-table-filter></song-list-table-filter>
  <v-table fixed-header fixed-footer :height="CLIENT_CONSTANTS.TABLE_HEIGHT">
    <thead>
      <tr>
        <th class="text-left" v-for="header in state.headers">
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
    <tr v-for="item in $store.getters.songList">
      <td>{{ item.anime_name }}</td>
      <td>{{ item.song_title }}</td>
      <td>{{ item.artist }}</td>
      <td>{{ item.type }}</td>
    </tr>
    </tbody>
    <tfoot>
      <tr>
        <td :colspan="state.headers.length">
          <song-list-table-pagination></song-list-table-pagination>
        </td>
      </tr>
    </tfoot>
  </v-table>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {CLIENT_CONSTANTS} from '../assets/constants'
import SongListTableFilter from './song-list-table/SongListTableFilter.vue'
import SongListTablePagination from './song-list-table/SongListTablePagination.vue'

const state = reactive({
  headers: ['Anime', 'Title', 'Artist', 'Type']
})
</script>
