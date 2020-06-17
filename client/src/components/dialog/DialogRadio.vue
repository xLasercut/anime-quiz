<template>
  <v-col cols="10">
    <v-radio-group
      v-bind="$attrs"
      :value="value" @input="$emit('input', $event)"
    >
      <v-radio v-for="item in items" v-bind="item"></v-radio>
    </v-radio-group>
  </v-col>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'

  export default defineComponent({
    props: {
      items: {
        required: true
      },
      value: {
        required: true
      }
    }
  })
</script>
