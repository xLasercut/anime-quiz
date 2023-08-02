<template>
  <custom-combobox
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
    :clearable="true"
    variant="outlined"
    density="compact"
    hide-details
  ></custom-combobox>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CustomCombobox from '@/components/common/inputs/CustomCombobox.vue';

export default defineComponent({
  props: {
    modelValue: {
      required: true,
      type: String
    }
  },
  components: { CustomCombobox }
});
</script>
