<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <song-list-table-filter></song-list-table-filter>
      <v-row justify="center" no-gutters>
        <v-col cols="12">
          <v-data-table
            disable-sort disable-filtering disable-pagination dense
            hide-default-footer
            :headers="headers"
            :items="displayData()"
          >
            <template #item.anime="{item}">
              {{item.anime[0]}}
            </template>

            <template #item.src="{item}">
              <a :href="item.src" target="_blank">View</a>
            </template>

            <template #item.action="{item}">
              <table-btn
                color="success" icon="mdi-plus"
                @click="$emit('user:add', item)"
                :disabled="disableAddBtn(item)"
              ></table-btn>
              <table-btn
                color="error" icon="mdi-minus"
                @click="$emit('user:delete', item)"
                :disabled="disableDeleteBtn(item)"
              ></table-btn>
              <table-btn
                color="warning" icon="mdi-pencil-plus"
                @click="$emit('admin:edit', item)"
                v-if="$store.state.client.admin"
              ></table-btn>
              <table-btn
                color="error" icon="mdi-delete"
                @click="$emit('admin:delete', item)"
                v-if="$store.state.client.admin"
              ></table-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <pagination
        v-model="currentPage"
        :max-page="maxPage" :items="items" :items-per-page.sync="itemsPerPage"
      ></pagination>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import {defineComponent, reactive, toRefs} from '@vue/composition-api'
  import TableBtn from '@/components/buttons/TableBtn.vue'
  import {ISong} from '../../../shared/interfaces/database'
  import SongListTableFilter from '@/list-picker/SongListTableFilter.vue'
  import Pagination from '@/components/Pagination.vue'

  export default defineComponent({
    components: {
      TableBtn, SongListTableFilter, Pagination
    },
    setup(_props, context) {
      const state = reactive({
        headers: [
          {text: 'Anime', value: 'anime', sortable: false},
          {text: 'Song', value: 'title', sortable: false},
          {text: 'Type', value: 'type', sortable: false, width: 100},
          {text: 'Link', value: 'src', sortable: false, width: 80},
          {text: 'Action', value: 'action', sortable: false, width: actionWidth()}
        ],
        currentPage: 1,
        maxPage: 1,
        items: [5, 10, 15, 20],
        itemsPerPage: 10
      })

      function actionWidth(): number {
        if (context.root.$store.state.client.admin) {
          return 200
        }
        return 120
      }

      function disableAddBtn(song: ISong): boolean {
        return (context.root.$store.state.list.userSongs.has(song.songId) ||
          !context.root.$store.state.list.currentUser)
      }

      function disableDeleteBtn(song: ISong): boolean {
        return (!context.root.$store.state.list.userSongs.has(song.songId) ||
          !context.root.$store.state.list.currentUser)
      }

      function displayData(): Array<ISong> {
        const filteredData = context.root.$store.getters.filteredSongList
        state.maxPage = Math.ceil(filteredData.length / state.itemsPerPage)
        if (state.currentPage > state.maxPage) {
          state.currentPage = 1
        }
        const startIndex = (state.currentPage - 1) * state.itemsPerPage
        const endIndex = startIndex + state.itemsPerPage
        return filteredData.slice(startIndex, endIndex)
      }


      return {
        ...toRefs(state),
        disableAddBtn,
        disableDeleteBtn,
        displayData
      }
    }
  })
</script>
