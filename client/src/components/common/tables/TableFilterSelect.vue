<template>
  <v-col>
    <v-select
      :model-value="modelValue"
      @update:model-value="$emit('update:model-value', $event || '')"
      variant="outlined"
      density="compact"
      :items="items"
      hide-details
      :label="label"
      :multiple="true"
    ></v-select>
  </v-col>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

defineProps({
  modelValue: {
    required: true,
    type: Object as PropType<any[]>
  },
  items: {
    type: Object as PropType<any[]>
  },
  label: {
    type: String
  }
});
</script>
