<template>
  <v-col cols="10">
    <v-text-field
      :value="value" @input="emitChange($event)"
      v-bind="$attrs" clearable outlined
      dense
      class="dialog-item"
    ></v-text-field>
  </v-col>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'

export default defineComponent({
  props: {
    value: {
      required: true
    }
  },
  setup(_props, context) {
    function emitChange(val: string): void {
      if (val) {
        context.emit('input', val)
      }
      else {
        context.emit('input', '')
      }
    }

    return {emitChange}
  }
})
</script>
