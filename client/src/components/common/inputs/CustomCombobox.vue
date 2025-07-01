<template>
  <v-combobox
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event || '')"
    :items="items"
    :hide-no-data="true"
    :hide-selected="false"
    :custom-filter="customFilter"
  ></v-combobox>
</template>

<script setup lang="ts">
import { isMatchFilter } from '@/assets/game-helpers';
import { PropType } from 'vue';

defineProps({
  modelValue: {
    required: true,
    type: String
  },
  items: {
    required: true,
    type: Array as PropType<string[]>
  },
  debounceTime: {
    type: Number,
    default: (): number => {
      return 100;
    }
  }
});
defineEmits(['update:modelValue']);

function customFilter(value: string, query: string) {
  return isMatchFilter(query, value);
}
</script>
