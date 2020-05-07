<template>
  <v-col cols="3">
    <v-text-field
      clearable hide-details v-bind="$attrs"
      outlined dense
      @input="$emit('input', $event)" :value="value"
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
    }
  })
</script>
