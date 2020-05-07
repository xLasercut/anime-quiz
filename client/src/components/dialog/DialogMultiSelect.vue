<template>
  <v-col cols="10">
    <v-combobox
      outlined
      multiple
      v-bind="$attrs"
      :value="value"
      @input="$emit('input', $event)"
      chips
      dense
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
    }
  })
</script>
