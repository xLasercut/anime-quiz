<template>
  <v-row :dense="true">
    <v-col>
      <table-filter-combobox
        label="Anime"
        :items="dataStore.animeNames"
        :model-value="anime"
        @update:model-value="updateAnimeFilter($event)"
      ></table-filter-combobox>
    </v-col>
    <v-col>
      <table-filter-combobox
        label="Song Title"
        :items="dataStore.songTitles"
        :model-value="title"
        @update:model-value="updateTitleFilter($event)"
      ></table-filter-combobox>
    </v-col>
    <v-col>
      <table-filter-text-field label="Artist" :model-value="artist" @update:model-value="updateArtistFilter($event)" hide-details></table-filter-text-field>
    </v-col>
    <v-col>
      <v-select
        :clearable="true"
        variant="outlined"
        density="compact"
        label="Type"
        hide-details
        :items="songTypes"
        :model-value="type"
        @update:model-value="updateTypeFilter($event)"
      ></v-select>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useDataStore } from '@/plugins/store/data';
import { debounce } from '@/assets/game-helpers';
import TableFilterTextField from '@/components/common/tables/TableFilterTextField.vue';
import TableFilterCombobox from '@/components/common/tables/TableFilterCombobox.vue';

export default defineComponent({
  components: { TableFilterCombobox, TableFilterTextField },
  props: {
    anime: {
      required: true,
      type: String
    },
    title: {
      required: true,
      type: String
    },
    artist: {
      required: true,
      type: String
    },
    type: {
      required: true,
      type: String
    }
  },
  setup(_props, context) {
    const dataStore = useDataStore();
    const state = reactive({
      songTypes: ['OP', 'ED', 'INSERT']
    });

    const updateAnimeFilter = debounce((val: string): void => {
      context.emit('update:anime', val);
    }, 150);

    const updateTitleFilter = debounce((val: string): void => {
      context.emit('update:title', val);
    }, 150);

    const updateArtistFilter = debounce((val: string): void => {
      context.emit('update:artist', val || '');
    }, 150);

    function updateTypeFilter(val: string): void {
      context.emit('update:type', val || '');
    }

    return {
      dataStore,
      updateAnimeFilter,
      updateTitleFilter,
      ...toRefs(state),
      updateArtistFilter,
      updateTypeFilter
    };
  }
});
</script>
