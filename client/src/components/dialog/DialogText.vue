<template>
  <v-col cols="10">
    <v-text-field
      :value="value" @input="$emit('input', $event)"
      v-bind="$attrs" clearable outlined
      dense
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
