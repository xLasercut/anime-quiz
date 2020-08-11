<template>
  <v-col :cols="cols">
    <v-text-field
      clearable hide-details v-bind="$attrs"
      outlined dense
      @input="emitChange($event)" :value="value"
    ></v-text-field>
  </v-col>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'

export default defineComponent({
  props: {
    value: {
      required: true
    },
    cols: {
      required: true
    }
  },
  setup(_prop, context) {
    function emitChange(value: string): void {
      if (!value) {
        context.emit('input', '')
      }
      else {
        context.emit('input', value)
      }
    }

    return {emitChange}
  }
})
</script>
