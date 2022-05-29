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
import IconBtn from '../../shared/buttons/IconBtn.vue'

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
  components: { IconBtn },
  setup(_props, context) {
    const state = reactive({
      songTypes: [
        { text: 'ALL', value: '' },
        { text: 'OP', value: 'OP' },
        { text: 'ED', value: 'ED' },
        { text: 'INSERT', value: 'INSERT' }
      ],
      show: true
    })

    function updateFilter(prop: string, event: string | null): void {
      const cleanedEvent = event || ''
      context.emit(`update:${prop}`, cleanedEvent.trim())
    }

    return {
      ...toRefs(state),
      updateFilter
    }
  }
})
</script>
