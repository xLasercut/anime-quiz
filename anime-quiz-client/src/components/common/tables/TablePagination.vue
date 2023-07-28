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
        @update:model-value="$emit('update:itemsPerPage', $event)"
        :items="itemsPerPageSelections"
      ></v-select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
  props: {
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
    }
  },
  setup() {
    const state = reactive({
      itemsPerPageSelections: [5, 10, 20, 30]
    });

    return { ...toRefs(state) };
  }
});
</script>
