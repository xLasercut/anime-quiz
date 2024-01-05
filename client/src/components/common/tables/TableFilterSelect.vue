<template>
  <v-col>
    <v-select
      :clearable="true"
      :model-value="modelValue"
      @update:model-value="$emit('update:model-value', $event || '')"
      variant="outlined"
      density="compact"
      :items="items"
      hide-details
      :label="label"
    ></v-select>
  </v-col>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

defineProps({
  modelValue: {
    required: true
  },
  items: {
    type: Object as PropType<any[]>
  },
  label: {
    type: String
  }
});
</script>
