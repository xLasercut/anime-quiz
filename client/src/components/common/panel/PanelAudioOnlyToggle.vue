<template>
  <v-checkbox-btn
    true-icon="mdi-video-off"
    false-icon="mdi-video"
    color="warning"
    base-color="success"
    density="compact"
    v-model="clientStore.audioOnly"
    v-bind="$attrs"
  ></v-checkbox-btn>
</template>

<script setup lang="ts">
import { useClientStore } from '@/plugins/store/client';

const clientStore = useClientStore();
</script>
