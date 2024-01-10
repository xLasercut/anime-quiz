<template>
  <v-combobox
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event || '')"
    :custom-filter="customFilter"
    :eager="true"
  ></v-combobox>
</template>

<script setup lang="ts">
import { isMatchFilter } from '@/assets/game-helpers';

defineProps({
  modelValue: {
    required: true
  }
});

function customFilter(value: string, query: string) {
  return isMatchFilter(query, value);
}
</script>
