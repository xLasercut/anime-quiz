<template>
  <v-combobox
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event || '')"
    :no-filter="true"
    :items="itemsList"
    :search="search"
    @update:search="updateSearch($event)"
    :hide-no-data="true"
    :hide-selected="false"
  ></v-combobox>
</template>

<script setup lang="ts">
import { debounce, isMatchFilter } from '@/assets/game-helpers';
import { computed, PropType, ref } from 'vue';

const props = defineProps({
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

const search = ref('');

const updateSearch = debounce((val: string) => {
  search.value = val || '';
}, props.debounceTime);

const itemsList = computed((): string[] => {
  if (!search.value) {
    return [];
  }

  return props.items.filter((item) => {
    return isMatchFilter(search.value, item);
  });
});
</script>
