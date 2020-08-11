<template>
  <v-row justify="center" align="center">
    <table-filter-text
      label="Anime" :value="$store.state.amq.songListFilter.anime"
      @input="updateSongFilter($event, 'anime')"
      cols="3"
    ></table-filter-text>
    <table-filter-text
      label="Title" :value="$store.state.amq.songListFilter.title"
      @input="updateSongFilter($event, 'title')"
      cols="3"
    ></table-filter-text>
    <table-filter-select
      label="Type" :value="$store.state.amq.songListFilter.type"
      :items="typeItems"
      @input="updateSongFilter($event, 'type')"
      cols="3"
    ></table-filter-select>
    <table-filter-select
      label="User" :value="$store.state.amq.currentUser"
      clearable
      :items="$store.state.amq.users"
      @change="changeUser($event)"
      cols="3"
    ></table-filter-select>
  </v-row>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from '@vue/composition-api'
import TableFilterText from '@/components/table/TableFilterText.vue'
import TableFilterSelect from '@/components/table/TableFilterSelect.vue'
import {debounce} from '@/assets/debounce'
import {socket} from '@/assets/socket'

export default defineComponent({
  components: {
    TableFilterText, TableFilterSelect
  },
  setup(_props, context) {
    const state = reactive({
      typeItems: ['All', 'OP', 'ED', 'Insert']
    })

    const updateSongFilter = debounce((value: string, key: string): void => {
      let newFilter = context.root.$store.state.amq.songListFilter
      newFilter[key] = value
      context.root.$store.commit('UPDATE_AMQ_SONG_LIST_FILTER', newFilter)
    }, 100)

    function changeUser(user: string) {
      context.root.$store.commit('UPDATE_AMQ_CURRENT_USER', user)
      if (user) {
        socket.emit('GET_AMQ_USER_SONGS', user)
      }
    }

    return {...toRefs(state), updateSongFilter, changeUser}
  }
})
</script>
