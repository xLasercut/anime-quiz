<template>
  <v-row justify="center" :dense="true">
    <v-col cols="12">
      <v-autocomplete
        label="Anime"
        item-title="animeName"
        item-value="animeId"
        :items="dataStore.animeStringList"
        variant="outlined"
        density="compact"
        :chips="true"
        :multiple="true"
        :rules="songAnimeIdRules"
        :disabled="disabled"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :custom-filter="filterItem"
      >
        <template #chip="{ item }">
          <v-chip color="primary" :label="true" size="small">{{ item.raw.animeName }}</v-chip>
        </template>
      </v-autocomplete>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { TAnimeId } from 'anime-quiz-shared-resources/src/models/types';
import { canParseValue, isMatchFilter } from '@/assets/game-helpers';
import { z } from 'zod';
import { AnimeId } from 'anime-quiz-shared-resources/src/models/anime';
import { useDataStore } from '@/plugins/store/data';

defineProps({
  modelValue: {
    required: true,
    type: Array as PropType<TAnimeId[]>
  },
  disabled: {
    type: Boolean,
    default: (): boolean => {
      return false;
    }
  }
});

defineEmits(['update:modelValue']);
const dataStore = useDataStore();

const songAnimeIdRules = [
  (v: string[]): boolean | string => v.length > 0 || 'Anime required',
  (v: string[]): boolean | string => canParseValue(v, z.array(AnimeId)) || 'Invalid anime'
];

function filterItem(value: string, query: string) {
  return isMatchFilter(query, value);
}
</script>
