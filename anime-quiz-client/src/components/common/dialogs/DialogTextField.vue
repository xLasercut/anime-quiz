<template>
  <v-row justify="center" no-gutters>
    <v-col cols="12">
      <v-text-field
        v-bind="$attrs"
        variant="outlined"
        density="comfortable"
        :clearable="true"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>
