<template>
  <v-combobox :model-value="modelValue" @update:model-value="$emit('update:model-value', $event || '')" :custom-filter="customFilter"></v-combobox>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { isMatchFilter } from '@/assets/game-helpers';

export default defineComponent({
  props: {
    modelValue: {
      required: true
    }
  },
  setup() {
    function customFilter(value: string, query: string) {
      return isMatchFilter(query, value);
    }

    return { customFilter };
  }
});
</script>
