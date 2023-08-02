<template>
  <v-row justify="center" :dense="true">
    <v-col cols="12">
      <v-radio-group :inline="true" v-bind="$attrs" variant="outlined" density="comfortable">
        <slot></slot>
      </v-radio-group>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>
