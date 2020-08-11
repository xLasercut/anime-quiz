<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-data-table
        disable-pagination disable-filtering disable-sort dense
        hide-default-footer
        :headers="headers"
        :items="displayData($store.getters.filteredChatBotList)"
      >
        <template #top>
          <chat-bot-list-table-filter></chat-bot-list-table-filter>
        </template>

        <template #item.avatar="{item}">
          <game-avatar :avatar="item.avatar"></game-avatar>
        </template>

        <template #item.action="{item}">
          <table-btn
            icon="mdi-pencil" color="warning"
            @click="$emit('chat:edit', item)"
          ></table-btn>
          <table-btn
            icon="mdi-delete" color="error"
            @click="$emit('chat:delete', item)"
          ></table-btn>
        </template>

        <template #footer>
          <pagination
            v-model="currentPage"
            :max-page="maxPage" :items="items" :items-per-page.sync="itemsPerPage"
          ></pagination>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from '@vue/composition-api'
import Pagination from '@/components/Pagination.vue'
import GameAvatar from '@/components/GameAvatar.vue'
import TableBtn from '@/components/buttons/TableBtn.vue'
import paginationApi from '@/assets/pagination'
import ChatBotListTableFilter from '@/chat-bot/ChatBotListTableFilter.vue'

export default defineComponent({
  components: {
    Pagination, GameAvatar, TableBtn, ChatBotListTableFilter
  },
  setup(_props, context) {
    const state = reactive({
      headers: [
        {text: 'Regex', value: 'regex'},
        {text: 'Flag', value: 'flag', width: 50},
        {text: 'ID', value: 'userId'},
        {text: 'Avatar', value: 'avatar', width: 50},
        {text: 'User', value: 'user'},
        {text: 'Text', value: 'text'},
        {text: 'Action', value: 'action', width: 120}
      ]
    })

    const {paginationState, displayData} = paginationApi()

    return {...toRefs(state), ...toRefs(paginationState), displayData}
  }
})
</script>
