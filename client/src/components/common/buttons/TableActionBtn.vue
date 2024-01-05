<template>
  <v-btn density="comfortable" variant="flat">
    <v-icon>{{ icon }}</v-icon>
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
