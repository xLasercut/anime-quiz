<template>
  <v-col>
    <v-text-field
      :model-value="modelValue"
      @update:model-value="$emit('update:model-value', $event || '')"
      variant="outlined"
      density="compact"
      :clearable="true"
      hide-details
      :label="label"
    ></v-text-field>
  </v-col>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    required: true
  },
  label: {
    type: String
  }
});
</script>
