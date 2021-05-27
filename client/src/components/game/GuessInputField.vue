<template>
  <v-col cols="12" sm="6" md="5">
    <v-combobox
      filled
      :search-input="value" @update:search-input="emitChange($event)"
      v-bind="$attrs"
      @keyup.native.enter="$emit('key:enter')"
      :error="!submitted"
      :success="submitted"
      persistent-hint
      :hint="value"
    ></v-combobox>
  </v-col>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'

export default defineComponent({
  props: {
    value: {
      required: true
    },
    submitted: {
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
