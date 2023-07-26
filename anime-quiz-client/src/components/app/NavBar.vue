<template>
  <v-toolbar height="40" :flat="true" color="surface">
    <v-toolbar-items>
      <nav-btn icon="mdi-theme-light-dark" @click="changeTheme()">Theme</nav-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <component :is="panelComponent()"></component>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script lang="ts">
import {Component, defineComponent} from 'vue';
import { LOCAL_STORAGE_CONSTANTS } from 'anime-quiz-client/src/assets/constants';
import { useTheme } from 'vuetify';
import {PANEL_MAPPING} from "@/plugins/routing/mapping";
import {useClientStore} from "@/plugins/store/client";
import NavBtn from "@/components/common/buttons/NavBtn.vue";

export default defineComponent({
  components: {NavBtn},
  setup() {
    const theme = useTheme();
    const clientStore = useClientStore()

    function panelComponent(): Component {
      return PANEL_MAPPING[clientStore.view]
    }

    function changeTheme(): void {
      theme.global.name.value = theme.global.name.value === 'dark' ? 'light' : 'dark';
      localStorage[LOCAL_STORAGE_CONSTANTS.DARK_THEME] = theme.global.name.value === 'dark';
    }

    return { changeTheme, panelComponent };
  }
});
</script>
