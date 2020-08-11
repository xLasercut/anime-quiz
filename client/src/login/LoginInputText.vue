<template>
  <v-row justify="center">
    <v-col cols="12" sm="6" no-gutters>
      <v-text-field
        filled clearable
        @click:append="$emit('click:append')"
        :value="value" @input="$emit('input', $event)"
        v-bind="$attrs"
      ></v-text-field>
    </v-col>
  </v-row>
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
