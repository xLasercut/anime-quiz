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

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const state = reactive({
      headers: ['Anime', 'Title', 'Artist', 'Type']
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>
