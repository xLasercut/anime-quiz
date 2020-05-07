<template>
  <v-col cols="3">
    <v-select
      outlined dense hide-details v-bind="$attrs"
      @input="$emit('input', $event)" :value="value"
      @change="$emit('change', $event)"
    ></v-select>
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
