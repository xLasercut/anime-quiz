<template>
  <v-btn depressed x-small @click="$emit('click')" v-bind="$attrs">
    <v-icon size="12pt">{{icon}}</v-icon>
  </v-btn>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'

  export default defineComponent({
    props: {
      icon: {
        required: true
      }
    }
  })
</script>

<style scoped>
  button {
    margin-right: 2px;
  }
</style>
