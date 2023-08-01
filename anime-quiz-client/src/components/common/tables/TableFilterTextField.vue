<template>
  <v-text-field :model-value="modelValue" @update:model-value="updateModel($event)"></v-text-field>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      required: true
    }
  },
  setup(_props, context) {
    function updateModel(val: string) {
      const valToSend = val || '';

      context.emit('update:model-value', valToSend);
    }

    return { updateModel };
  }
});
</script>
