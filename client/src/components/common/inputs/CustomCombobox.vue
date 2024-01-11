<template>
  <v-combobox
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event || '')"
    :eager="true"
    :no-filter="true"
    :items="itemsList()"
    v-model:search="search"
  ></v-combobox>
</template>

<script setup lang="ts">
import { isMatchFilter } from '@/assets/game-helpers';
import { PropType, ref } from 'vue';

const props = defineProps({
  modelValue: {
    required: true,
    type: String
  },
  items: {
    required: true,
    type: Array as PropType<string[]>
  }
});
defineEmits(['update:modelValue']);

const search = ref('');

function itemsList(): string[] {
  if (!search.value) {
    return [];
  }

  return props.items.filter((item) => {
    return isMatchFilter(search.value, item);
  });
}
</script>
