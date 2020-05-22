<template>
  <v-row justify="center">
    <v-col cols="12">
      <emoji-list-table-filter></emoji-list-table-filter>
      <v-row justify="center" no-gutters>
        <v-col cols="12">
          <v-data-table
            disable-pagination disable-filtering disable-sort dense
            hide-default-footer
            :headers="headers()"
            :items="displayData()"
          >
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
          </v-data-table>
          <pagination
            v-model="currentPage"
            :max-page="maxPage" :items="items" :items-per-page.sync="itemsPerPage"
          ></pagination>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import {defineComponent, reactive, toRefs} from '@vue/composition-api'
  import Pagination from '@/components/Pagination.vue'
  import EmojiListTableFilter from '@/misc/emoji/EmojiListTableFilter.vue'
  import {IEmoji, ISong} from '../../../../shared/interfaces/database'
  import EmojiPreview from '@/misc/emoji/EmojiPreview.vue'
  import TableBtn from '@/components/buttons/TableBtn.vue'

  export default defineComponent({
    components: {
      Pagination, EmojiListTableFilter, EmojiPreview, TableBtn
    },
    setup(_props, context) {
      const state = reactive({
        currentPage: 1,
        maxPage: 1,
        items: [5, 10, 15, 20],
        itemsPerPage: 10
      })

      function displayData(): Array<IEmoji> {
        const filteredData = context.root.$store.getters.filteredEmojiList
        state.maxPage = Math.ceil(filteredData.length / state.itemsPerPage)
        if (state.currentPage > state.maxPage) {
          state.currentPage = 1
        }
        const startIndex = (state.currentPage - 1) * state.itemsPerPage
        const endIndex = startIndex + state.itemsPerPage
        return filteredData.slice(startIndex, endIndex)
      }

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

      return {...toRefs(state), displayData, headers}
    }
  })
</script>
