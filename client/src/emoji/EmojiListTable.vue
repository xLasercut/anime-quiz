<template>
  <v-row justify="center" dense>
    <v-col cols="12">
      <v-data-table
        disable-pagination disable-filtering disable-sort dense
        hide-default-footer
        :headers="headers()"
        :items="displayData($store.getters.filteredEmojiList)"
      >
        <template #top>
          <emoji-list-table-filter></emoji-list-table-filter>
        </template>

        <template #item.command="{item}">
          :{{item.command}}:
        </template>

        <template #item.emoji="{item}">
          <emoji-preview :emoji="item"></emoji-preview>
        </template>

        <template #item.src="{item}">
          <a :href="item.src" target="_blank" v-if="item.type === 'img'">View</a>
          <span v-else>{{item.src}}</span>
        </template>

        <template #item.action="{item}">
          <table-btn
            icon="mdi-pencil" color="warning"
            @click="$emit('emoji:edit', item)"
          ></table-btn>
          <table-btn
            icon="mdi-delete" color="error"
            @click="$emit('emoji:delete', item)"
          ></table-btn>
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
import {defineComponent, toRefs} from '@vue/composition-api'
import TableBtn from '@/components/buttons/TableBtn.vue'
import Pagination from '@/components/Pagination.vue'
import paginationApi from '@/assets/pagination'
import EmojiPreview from '@/emoji/EmojiPreview.vue'
import EmojiListTableFilter from '@/emoji/EmojiListTableFilter.vue'

export default defineComponent({
  components: {
    TableBtn, Pagination, EmojiPreview, EmojiListTableFilter
  },
  setup(_props, context) {
    const {paginationState, displayData} = paginationApi()

    function headers(): Array<any> {
      let headers = [
        {text: 'Command', value: 'command'},
        {text: 'Emoji', value: 'emoji'},
        {text: 'Type', value: 'type'},
        {text: 'Source', value: 'src', width: 100}
      ]

      if (context.root.$store.state.client.admin) {
        headers.push({text: 'Action', value: 'action', width: 120})
      }
      return headers
    }

    return {...toRefs(paginationState), displayData, headers}
  }
})
</script>
