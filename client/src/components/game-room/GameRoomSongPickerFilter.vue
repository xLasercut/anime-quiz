<template>
  <v-row dense>
    <v-col>
      <filtered-combobox
        dense
        outlined
        :value="animeFilter"
        @input="updateFilter('anime-filter', $event)"
        label="Anime"
        :items="$store.getters.animeList"
        hide-details
        clearable
      ></filtered-combobox>
    </v-col>
    <v-col>
      <filtered-combobox
        :value="songTitleFilter"
        @input="updateFilter('song-title-filter', $event)"
        dense
        outlined
        label="Title"
        :items="$store.getters.songTitleList"
        hide-details
        clearable
      ></filtered-combobox>
    </v-col>
    <v-col>
      <v-select
        :value="songTypeFilter"
        @input="updateFilter('song-type-filter', $event)"
        :items="songTypes"
        dense
        outlined
        label="Type"
        hide-details
      ></v-select>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { SONG_TYPES } from '../../assets/constants';
import { newTableHelpers } from '../../assets/table-helper';
import FilteredCombobox from '../shared/comboboxes/FilteredCombobox.vue';

export default defineComponent({
  components: { FilteredCombobox },
  props: {
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
      songTypes: [{ text: 'ALL', value: '' }].concat(SONG_TYPES)
    });

    const { updateFilter } = newTableHelpers(context);

    return {
      ...toRefs(state),
      updateFilter
    };
  }
});
</script>
