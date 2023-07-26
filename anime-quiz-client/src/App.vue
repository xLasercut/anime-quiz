<template>
  <v-app>
    <nav-bar></nav-bar>
    <v-container :fluid="true">
      <component :is="viewComponent()"></component>
    </v-container>
    <system-notification></system-notification>
  </v-app>
</template>

<script lang="ts">
import {Component, defineComponent, onMounted, provide} from 'vue';
import { VIEW_MAPPING } from '@/plugins/routing/mapping';
import { useClientStore } from '@/plugins/store/client';
import NavBar from '@/components/app/NavBar.vue';
import SystemNotification from '@/components/app/SystemNotification.vue';
import { CLIENT_EVENTS } from '@/assets/events';
import {LOCAL_STORAGE_CONSTANTS} from "@/assets/constants";

export default defineComponent({
  components: { SystemNotification, NavBar },
  setup() {
    const clientStore = useClientStore();

    let systemNotification: Function;
    provide(CLIENT_EVENTS.REGISTER_SYSTEM_NOTIFICATION, (_systemNotification: Function): void => {
      systemNotification = _systemNotification;
    });

    function viewComponent(): Component {
      return VIEW_MAPPING[clientStore.view];
    }

    onMounted(() => {
      if (!localStorage[LOCAL_STORAGE_CONSTANTS.GAME_SERVER]) {
        systemNotification("error", "Server URL not set")
      }
    })

    return { viewComponent };
  }
});
</script>
