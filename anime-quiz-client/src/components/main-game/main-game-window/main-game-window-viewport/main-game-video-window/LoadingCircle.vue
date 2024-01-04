<template>
  <v-progress-circular :size="100" :width="5" indeterminate color="primary" v-show="show"></v-progress-circular>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const show = ref(false);
</script>
