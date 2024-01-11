<template>
  <v-btn density="comfortable" :icon="icon" variant="text"></v-btn>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    required: true,
    type: String
  }
});
</script>
