<template>
  <v-row :dense="true">
    <table-filter-combobox
      label="Anime"
      :items="dataStore.animeNames"
      :model-value="anime"
      @update:model-value="updateAnimeFilter($event)"
    ></table-filter-combobox>
    <table-filter-combobox
      label="Song Title"
      :items="dataStore.songTitles"
      :model-value="title"
      @update:model-value="updateTitleFilter($event)"
    ></table-filter-combobox>
    <table-filter-text-field
      label="Artist"
      :model-value="artist"
      @update:model-value="updateArtistFilter($event)"
    ></table-filter-text-field>
    <table-filter-select
      :items="songTypes"
      :model-value="type"
      @update:model-value="updateTypeFilter($event)"
      label="Type"
    ></table-filter-select>
  </v-row>
</template>

<script setup lang="ts">
import { useDataStore } from '@/plugins/store/data';
import { debounce } from '@/assets/game-helpers';
import TableFilterTextField from '@/components/common/tables/TableFilterTextField.vue';
import TableFilterCombobox from '@/components/common/tables/TableFilterCombobox.vue';
import TableFilterSelect from '@/components/common/tables/TableFilterSelect.vue';

defineProps({
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
});

const emit = defineEmits(['update:anime', 'update:title', 'update:artist', 'update:type']);
const dataStore = useDataStore();
const songTypes = ['OP', 'ED', 'INSERT'];

const updateAnimeFilter = debounce((val: string): void => {
  emit('update:anime', val);
}, 150);

const updateTitleFilter = debounce((val: string): void => {
  emit('update:title', val);
}, 150);

const updateArtistFilter = debounce((val: string): void => {
  emit('update:artist', val);
}, 150);

function updateTypeFilter(val: string): void {
  emit('update:type', val);
}
</script>
