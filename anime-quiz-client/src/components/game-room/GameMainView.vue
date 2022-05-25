<template>
  <v-col cols="7" sm="8">
    <v-card flat :height="CLIENT_CONSTANTS.PAGE_HEIGHT"></v-card>
  </v-col>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { CLIENT_CONSTANTS } from '../../assets/constants'

export default defineComponent({
  setup() {
    return {
      CLIENT_CONSTANTS
    }
  }
})
</script>
