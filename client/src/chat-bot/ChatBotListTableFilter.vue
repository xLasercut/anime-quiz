<template>
  <v-row justify="center" align="center">
    <table-filter-text
      label="Regex"
      :value="$store.state.chatBot.chatBotListFilter.regex"
      @input="updateChatBotListFilter($event, 'regex')"
      clearable
      cols="6"
    ></table-filter-text>
  </v-row>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import TableFilterText from '@/components/table/TableFilterText.vue'
import {debounce} from '@/assets/debounce'

export default defineComponent({
  components: {
    TableFilterText
  },
  setup(_props, context) {
    const updateChatBotListFilter = debounce((value: string, key: string): void => {
      let newFilter = context.root.$store.state.chatBot.chatBotListFilter
      newFilter[key] = value
      context.root.$store.commit('UPDATE_CHAT_BOT_LIST_FILTER', newFilter)
    }, 100)

    return {updateChatBotListFilter}
  }
})
</script>
