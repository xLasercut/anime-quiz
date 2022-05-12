<template>
  <v-row justify="center">
    <v-col cols="12" sm="7">
      <v-text-field
        filled
        clearable
        v-bind="$attrs"
        :value="value"
        @input="$emit('input', $event)"
      ></v-text-field>
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
