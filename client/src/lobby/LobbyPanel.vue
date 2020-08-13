<template>
  <v-toolbar-items>
    <nav-btn icon="mdi-logout" color="error" @click="logOut()"></nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import NavBtn from '@/components/buttons/NavBtn.vue'

export default defineComponent({
  components: {
    NavBtn
  },
  setup(_props, context) {
    function logOut(): void {
      context.root.$store.commit('UPDATE_VIEW', 'login')
    }

    return {logOut}
  }
})
</script>
