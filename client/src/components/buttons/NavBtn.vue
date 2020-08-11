<template>
  <v-btn @click="$emit('click')" v-on="activator" small text v-bind="$attrs">
    <v-icon>{{icon}}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'

export default defineComponent({
  props: {
    icon: {
      required: true
    },
    activator: {}
  }
})
</script>
