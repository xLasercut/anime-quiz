<template>
  <v-row dense>
    <v-col>
      <v-combobox
        @change="updateFilter()"
        dense outlined
        v-model.trim="animeFilter"
        label="Anime"
        :items="$store.state.songList.animeList"
        hide-details
        clearable
      ></v-combobox>
    </v-col>
    <v-col>
      <v-combobox
        @change="updateFilter()"
        v-model.trim="songTitleFilter"
        dense outlined label="Title"
        :items="$store.state.songList.songTitleList"
        hide-details
        clearable
      ></v-combobox>
    </v-col>
    <v-col>
      <v-select
        @change="updateFilter()"
        v-model="songTypeFilter"
        :items="songTypes"
        dense outlined label="Type"
        hide-details
      ></v-select>
    </v-col>
    <v-col>
      <v-select
        :value="value"
        @input="$emit('input', $event)"
        :items="$store.state.songList.userLists"
        hide-details
        outlined
        dense
        label="User"
        item-text="username"
        item-value="user_id"
        clearable
      ></v-select>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { store } from '../../../plugins/store'
import { MUTATIONS } from '../../../plugins/store/mutations'
import IconBtn from '../../shared/buttons/IconBtn.vue'
import { debounce } from '../../../assets/debounce'

export default defineComponent({
  props: {
    value: {
      required: true
    }
  },
  components: { IconBtn },
  setup() {
    const state = reactive({
      animeFilter: store.state.songList.animeFilter,
      songTypeFilter: store.state.songList.songTypeFilter,
      songTitleFilter: store.state.songList.songTitleFilter,
      songTypes: [
        { text: 'ALL', value: '' },
        { text: 'OP', value: 'OP' },
        { text: 'ED', value: 'ED' }
      ],
      show: true
    })

    const updateFilter = debounce(() => {
      store.commit(MUTATIONS.UPDATE_SONG_LIST_ANIME_FILTER, state.animeFilter || '')
      store.commit(MUTATIONS.UPDATE_SONG_LIST_TITLE_FILTER, state.songTitleFilter || '')
      store.commit(MUTATIONS.UPDATE_SONG_LIST_TYPE_FILTER, state.songTypeFilter || '')
    }, 100)

    return {
      ...toRefs(state),
      updateFilter
    }
  }
})
</script>
