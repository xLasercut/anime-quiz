<template>
  <v-toolbar-items>
    <nav-btn icon="mdi-play"></nav-btn>
    <nav-btn icon="mdi-stop"></nav-btn>
    <nav-btn icon="mdi-cog"></nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'
  import NavBtn from '@/components/buttons/NavBtn.vue'

  export default defineComponent({
    components: {
      NavBtn
    }
  })
</script>
