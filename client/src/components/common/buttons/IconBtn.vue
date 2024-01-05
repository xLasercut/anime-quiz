<template>
  <v-btn :append-icon="icon" variant="flat">
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
