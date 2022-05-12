<template>
  <v-data-table :headers="headers" fixed-header fixed-footer :height="CLIENT_CONSTANTS.TABLE_HEIGHT">
<!--    <thead>-->
<!--      <tr>-->
<!--        <th class="text-left" v-for="header in state.headers">-->
<!--          {{ header }}-->
<!--        </th>-->
<!--      </tr>-->
<!--    </thead>-->
<!--    <tbody>-->
<!--    <tr v-for="item in $store.getters.songList">-->
<!--      <td>{{ item.anime_name }}</td>-->
<!--      <td>{{ item.song_title }}</td>-->
<!--      <td>{{ item.artist }}</td>-->
<!--      <td>{{ item.type }}</td>-->
<!--    </tr>-->
<!--    </tbody>-->
<!--    <tfoot>-->
<!--      <tr>-->
<!--        <td :colspan="state.headers.length">-->
<!--          <song-list-table-pagination></song-list-table-pagination>-->
<!--        </td>-->
<!--      </tr>-->
<!--    </tfoot>-->
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { CLIENT_CONSTANTS } from '../../assets/constants'

export default defineComponent({
  setup() {
    const state = reactive({
      headers: [
        {
          text: 'Anime',
          value: 'anime_name'
        },
        {
          text: 'Title',
          value: 'song_title'
        },
        {
          text: 'Artist',
          value: 'artist'
        },
        {
          text: 'Type',
          value: 'type'
        }
      ]
    })

    return {
      ...toRefs(state),
      CLIENT_CONSTANTS
    }
  }
})
</script>
