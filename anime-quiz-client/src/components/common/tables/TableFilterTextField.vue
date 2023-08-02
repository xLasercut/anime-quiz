<template>
  <v-text-field
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event || '')"
    variant="outlined"
    density="compact"
    :clearable="true"
    hide-details
  ></v-text-field>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      required: true
    }
  }
});
</script>
