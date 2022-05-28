<template>
  <v-app-bar app flat height="40" min-height="40">
    <v-toolbar-items>
      <nav-btn icon="mdi-theme-light-dark" @click="changeTheme()">Theme</nav-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api'
import { LOCAL_STORAGE_CONSTANTS } from '../../assets/shared/constants'
import NavBtn from '../shared/buttons/NavBtn.vue'

export default defineComponent({
  components: { NavBtn },
  setup(_props, context) {
    const vuetify = context.root.$vuetify

    function changeTheme(): void {
      vuetify.theme.dark = !vuetify.theme.dark
      localStorage[LOCAL_STORAGE_CONSTANTS.DARK_THEME] = vuetify.theme.dark
    }

    onMounted(() => {
      vuetify.theme.dark = localStorage[LOCAL_STORAGE_CONSTANTS.DARK_THEME] === 'true'
    })

    return {
      changeTheme
    }
  }
})
</script>
