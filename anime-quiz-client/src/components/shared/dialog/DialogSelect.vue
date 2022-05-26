<template>
  <v-row justify="center" no-gutters>
    <v-col cols="12">
      <v-select v-bind="$attrs" :value="value" @input="$emit('input', $event)" outlined></v-select>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    value: {}
  }
})
</script>
