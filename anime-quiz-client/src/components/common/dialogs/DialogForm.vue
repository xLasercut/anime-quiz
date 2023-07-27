<template>
  <v-form v-bind="$attrs">
    <v-container :fluid="true">
      <slot></slot>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>
