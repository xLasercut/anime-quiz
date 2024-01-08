<template>
  <v-row justify="center" :dense="true">
    <v-col cols="12">
      <v-slider
        :model-value="modelValue"
        @update:model-value="$emit('update:model-value', $event)"
        step="1"
        v-bind="$attrs"
        color="primary"
      >
        <template #append>
          <v-text-field
            :model-value="modelValue"
            @update:model-value="updateModel($event)"
            density="compact"
            type="number"
            hide-details
            single-line
            style="width: 90px"
            variant="outlined"
          ></v-text-field>
        </template>
      </v-slider>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    required: true,
    type: Number
  }
});

const emit = defineEmits(['update:model-value']);

function updateModel(val: any) {
  try {
    const intModelValue = parseInt(val);
    emit('update:model-value', intModelValue);
  } catch {
    emit('update:model-value', 0);
  }
}
</script>
