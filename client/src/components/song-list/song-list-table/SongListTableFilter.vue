<template>
  <v-row dense>
    <v-col>
      <v-combobox
        dense outlined
        :value="animeFilter"
        @input="updateFilter('anime-filter', $event)"
        label="Anime"
        :items="$store.state.songList.animeList"
        hide-details
        clearable
      ></v-combobox>
    </v-col>
    <v-col>
      <v-combobox
        :value="songTitleFilter"
        @input="updateFilter('song-title-filter', $event)"
        dense outlined label="Title"
        :items="$store.state.songList.songTitleList"
        hide-details
        clearable
      ></v-combobox>
    </v-col>
    <v-col>
      <v-select
        :value="songTypeFilter"
        @input="updateFilter('song-type-filter', $event)"
        :items="songTypes"
        dense outlined label="Type"
        hide-details
      ></v-select>
    </v-col>
    <v-col>
      <v-select
        :value="selectedUser"
        @input="updateFilter('selected-user', $event)"
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
import { SONG_TYPES } from '../../../assets/constants'
import { newTableHelpers } from '../../../assets/table-helper'

export default defineComponent({
  props: {
    selectedUser: {
      required: true
    },
    animeFilter: {
      required: true
    },
    songTypeFilter: {
      required: true
    },
    songTitleFilter: {
      required: true
    }
  },
  setup(_props, context) {
    const state = reactive({
      songTypes: [
        { text: 'ALL', value: '' }
      ].concat(SONG_TYPES)
    })

    const { updateFilter } = newTableHelpers(context)

    return {
      ...toRefs(state),
      updateFilter
    }
  }
})
</script>
