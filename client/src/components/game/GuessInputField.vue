<template>
  <v-col cols="12" sm="6" md="5">
    <v-combobox
      filled hide-details
      :search-input="value" @update:search-input="emitChange($event)"
      v-bind="$attrs"
    ></v-combobox>
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
