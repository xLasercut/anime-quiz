<template>
  <div class="v-data-table-footer">
    <div class="v-data-table-footer__pagination">
      <v-pagination
        :model-value="currentPage"
        @update:model-value="$emit('update:currentPage', $event)"
        density="comfortable"
        :length="length"
        active-color="primary"
        total-visible="10"
      ></v-pagination>
    </div>
    <div class="v-data-table-footer__items-per-page">
      <v-select
        width="200px"
        density="compact"
        variant="outlined"
        :hide-details="true"
        :model-value="itemsPerPage"
        @update:model-value="updateItemsPerPage($event)"
        :items="itemsPerPageSelections"
      ></v-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { TLocalStorageConstant } from '@/assets/types';

const props = defineProps({
  currentPage: {
    required: true,
    type: Number
  },
  itemsPerPage: {
    required: true,
    type: Number
  },
  length: {
    required: true,
    type: Number
  },
  localStorageKey: {
    required: true,
    type: String as PropType<TLocalStorageConstant>
  }
});

const emit = defineEmits(['update:currentPage', 'update:itemsPerPage']);

function updateItemsPerPage(val: number) {
  localStorage[props.localStorageKey] = val;
  emit('update:itemsPerPage', val);
}

const itemsPerPageSelections = [5, 10, 15, 20, 30];
</script>
