<template>
  <v-toolbar-items>
    <nav-btn icon="mdi-logout">Back</nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import NavBtn from '../shared/buttons/NavBtn.vue'

export default defineComponent({
  components: { NavBtn }
})
</script>
