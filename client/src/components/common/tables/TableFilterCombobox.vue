<template>
  <v-col>
    <custom-combobox
      :model-value="modelValue"
      @update:model-value="$emit('update:model-value', $event || '')"
      :clearable="true"
      variant="outlined"
      density="compact"
      hide-details
      :items="items"
      :label="label"
    ></custom-combobox>
  </v-col>
</template>

<script setup lang="ts">
import CustomCombobox from '@/components/common/inputs/CustomCombobox.vue';

defineProps({
  modelValue: {
    required: true,
    type: String
  },
  items: {},
  label: {}
});
</script>
