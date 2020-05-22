<template>
  <v-toolbar-items>
    <nav-btn color="warning" icon="mdi-sync"></nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'
  import NavBtn from '@/components/buttons/NavBtn.vue'

  export default defineComponent({
    components: {
      NavBtn
    },
    setup(_props, _context) {

    }
  })
</script>
