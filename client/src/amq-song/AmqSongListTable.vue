<template>
  <v-row justify="center" dense>
    <v-col cols="12">
      <v-data-table
        disable-sort disable-filtering disable-pagination dense
        hide-default-footer
        :headers="headers"
        :items="displayData($store.getters.filteredAmqSongList)"
      >
        <template #top>
          <amq-song-list-table-filter></amq-song-list-table-filter>
        </template>

        <template #item.anime="{item}">
          {{ item.anime[0] }}
        </template>

        <template #item.src="{item}">
          <a :href="item.src" target="_blank">View</a>
        </template>

        <template #item.action="{item}">
          <slot name="action" :item="item">
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
          </slot>
        </template>

        <template #footer>
          <pagination
            v-model="currentPage"
            :max-page="maxPage"
            :items="items"
            :items-per-page.sync="itemsPerPage"
          ></pagination>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from '@vue/composition-api'
import paginationApi from '@/assets/pagination'
import Pagination from '@/components/Pagination.vue'
import AmqSongListTableFilter from '@/amq-song/AmqSongListTableFilter.vue'
import {IAmqSong} from '../../../shared/interfaces/database'
import TableBtn from '@/components/buttons/TableBtn.vue'

export default defineComponent({
  components: {
    Pagination, AmqSongListTableFilter, TableBtn
  },
  setup(_props, context) {
    const state = reactive({
      headers: [
        {text: 'Anime', value: 'anime', sortable: false},
        {text: 'Song', value: 'title', sortable: false},
        {text: 'Type', value: 'type', sortable: false, width: 100},
        {text: 'Link', value: 'src', sortable: false, width: 80},
        {text: 'Action', value: 'action', sortable: false, width: actionWidth()}
      ]
    })

    const {paginationState, displayData} = paginationApi()

    function actionWidth(): number {
      if (context.root.$store.state.client.admin) {
        return 200
      }
      return 120
    }

    function disableAddBtn(song: IAmqSong): boolean {
      return (context.root.$store.state.amq.userSongs.has(song.songId) ||
        !context.root.$store.state.amq.currentUser)
    }

    function disableDeleteBtn(song: IAmqSong): boolean {
      return (!context.root.$store.state.amq.userSongs.has(song.songId) ||
        !context.root.$store.state.amq.currentUser)
    }

    return {...toRefs(state), ...toRefs(paginationState), displayData, disableAddBtn, disableDeleteBtn}
  }
})
</script>
