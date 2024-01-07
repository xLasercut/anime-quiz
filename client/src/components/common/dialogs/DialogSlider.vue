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
            @update:model-value="$emit('update:model-value', $event)"
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
</script>
