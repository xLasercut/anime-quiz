<template>
  <v-btn :append-icon="icon" size="small" density="comfortable" variant="text">
    <slot></slot>
  </v-btn>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    required: true,
    type: String
  }
});
</script>
