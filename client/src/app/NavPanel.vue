<template>
  <v-app-bar app flat height="60px" min-height="60px">
    <v-toolbar-items>
      <nav-btn icon="mdi-theme-light-dark" @click="toggleTheme()"></nav-btn>
      <nav-btn icon="mdi-home" color="primary" @click="toLobby()" v-if="showHome()"></nav-btn>
      <nav-btn icon="mdi-arrow-left-bold" color="info" @click="toRoomList()" v-if="showBack()"></nav-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <slot></slot>
  </v-app-bar>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import NavBtn from '@/components/buttons/NavBtn.vue'

export default defineComponent({
  components: {
    NavBtn
  },
  setup(_props, context) {
    const showBackList = new Set(['amq_game'])

    function toggleTheme(): void {
      context.root.$vuetify.theme.dark = !context.root.$vuetify.theme.dark
      localStorage.dark = context.root.$vuetify.theme.dark
    }

    function toLobby(): void {
      context.root.$store.commit('UPDATE_VIEW', 'lobby')
    }

    function showHome(): boolean {
      return (context.root.$store.state.client.view !== 'login' && context.root.$store.state.client.view !== 'lobby')
    }

    function toRoomList(): void {
      return context.root.$store.commit('UPDATE_VIEW', `${context.root.$store.state.client.view}_room_list`)
    }

    function showBack(): boolean {
      return showBackList.has(context.root.$store.state.client.view)
    }

    return {toggleTheme, toLobby, showHome, toRoomList, showBack}
  }
})
</script>
