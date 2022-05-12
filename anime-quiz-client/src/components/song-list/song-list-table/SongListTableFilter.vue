<template>
  <v-container fluid>
    <v-form @submit.prevent="updateFilter()">
      <v-row>
        <v-col>
          <v-combobox
            @keyup.native.enter="updateFilter()"
            item-text="anime_name"
            item-value="anime_name"
            dense outlined
            v-model.trim="animeFilter"
            label="Anime"
            :items="$store.state.songList.animeList"
            hide-details
          ></v-combobox>
        </v-col>
        <v-col>
          <v-combobox
            @keyup.native.enter="updateFilter()"
            v-model.trim="songTitleFilter"
            dense outlined label="Title"
            hide-details
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
        <v-col cols="auto">
          <icon-btn type="submit" color="success" icon="mdi-magnify">Search</icon-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { store } from '../../../plugins/store'
import { MUTATIONS } from '../../../plugins/store/mutations'
import IconBtn from '../../shared/buttons/IconBtn.vue'

export default defineComponent({
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

    function updateFilter(): void {
      store.commit(MUTATIONS.UPDATE_SONG_LIST_ANIME_FILTER, state.animeFilter || '')
      store.commit(MUTATIONS.UPDATE_SONG_LIST_TITLE_FILTER, state.songTitleFilter || '')
      store.commit(MUTATIONS.UPDATE_SONG_LIST_TYPE_FILTER, state.songTypeFilter || '')
    }

    return {
      ...toRefs(state),
      updateFilter
    }
  }
})
</script>
