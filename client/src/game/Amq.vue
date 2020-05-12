<template>
  <v-row>
    {{$store.state.amq.playerList}}
  </v-row>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'

  export default defineComponent({})
</script>
