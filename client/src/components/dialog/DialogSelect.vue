<template>
  <v-col cols="10">
    <v-select
      v-bind="$attrs"
      :value="value"
      @input="$emit('input', $event)"
      outlined
      dense
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
