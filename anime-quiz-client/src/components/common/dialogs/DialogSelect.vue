<template>
  <v-row justify="center" :dense="true">
    <v-col cols="12">
      <v-select v-bind="$attrs" variant="outlined" density="comfortable" :clearable="true"></v-select>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>
