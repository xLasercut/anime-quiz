<template>
  <v-row justify="center" no-gutters>
    <v-col cols="12">
      <v-text-field
        v-bind="$attrs"
        clearable
        outlined
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({})
</script>
