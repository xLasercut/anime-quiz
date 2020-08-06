<template>
  <v-app-bar app flat height="60px" min-height="60px">
    <v-toolbar-items>
      <nav-btn icon="mdi-theme-light-dark" @click="toggleTheme()"></nav-btn>
      <nav-btn icon="mdi-home" color="primary" @click="$router.push('/login')" v-if="showHome"></nav-btn>
      <nav-btn icon="mdi-arrow-left-bold" color="info" @click="$emit('screen:back')" v-if="showBack"></nav-btn>
      <nav-btn icon="mdi-shield-account" color="warning" @click="showAdminControls()"
               v-if="$store.state.client.admin"></nav-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <slot></slot>
  </v-app-bar>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import NavBtn from '@/components/buttons/NavBtn.vue'
import GameDialog from '@/components/GameDialog.vue'
import IconBtn from '@/components/buttons/IconBtn.vue'
import DialogText from '@/components/dialog/DialogText.vue'
import DialogSelect from '@/components/dialog/DialogSelect.vue'
import {EventBus} from '@/assets/events'

export default defineComponent({
  props: {
    showHome: {
      type: Boolean,
      default: false
    },
    showBack: {
      type: Boolean,
      default: false
    }
  },
  components: {
    NavBtn, GameDialog, IconBtn, DialogText, DialogSelect
  },
  setup(_props, context) {

    function toggleTheme(): void {
      context.root.$vuetify.theme.dark = !context.root.$vuetify.theme.dark
      localStorage.dark = context.root.$vuetify.theme.dark
    }

    function showAdminControls(): void {
      EventBus.$emit('GLOBAL_DIALOG', 'admin', 'Admin')
    }

    return {toggleTheme, showAdminControls}
  }
})
</script>
