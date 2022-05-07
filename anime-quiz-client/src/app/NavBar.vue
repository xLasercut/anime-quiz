<template>
  <v-app-bar flat absolute>
    <v-btn size="large" append-icon="fa-solid fa-sun" @click="changeTheme()">Theme</v-btn>
    <v-spacer></v-spacer>
    <component :is="panelComponent()"></component>
  </v-app-bar>
</template>

<script setup lang="ts">
import {useStore} from 'vuex'
import {panelComponent} from '../plugins/routing/mapping'

const store = useStore()

function changeTheme(): void {
  store.commit('client/CHANGE_THEME')
  localStorage.darkTheme = store.state.client.darkTheme
}
</script>
