<template>
  <v-toolbar-items>
    <nav-btn icon="mdi-cog" color="info"></nav-btn>
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
