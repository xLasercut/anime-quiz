<template>
  <v-row :dense="true">
    <table-filter-text-field label="Anime ID" :model-value="animeId" @update:model-value="updateAnimeId($event)"></table-filter-text-field>
    <table-filter-combobox
      label="Anime Name"
      :items="dataStore.animeNames"
      :model-value="animeName"
      @update:model-value="updateAnimeName($event)"
    ></table-filter-combobox>
  </v-row>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import TableFilterTextField from '@/components/common/tables/TableFilterTextField.vue';
import TableFilterCombobox from '@/components/common/tables/TableFilterCombobox.vue';
import { TAnimeId } from 'anime-quiz-shared-resources';
import { debounce } from '@/assets/game-helpers';
import { useDataStore } from '@/plugins/store/data';

defineProps({
  animeId: {
    required: true,
    type: String as PropType<TAnimeId>
  },
  animeName: {
    required: true,
    type: String
  }
});
const emit = defineEmits(['update:anime-id', 'update:anime-name']);
const dataStore = useDataStore();
const updateAnimeId = debounce((val: string) => {
  emit('update:anime-id', val);
}, 100);
const updateAnimeName = debounce((val: string) => {
  emit('update:anime-name', val);
}, 100);
</script>
