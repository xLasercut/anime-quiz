<template>
  <v-app>
    <system-notification></system-notification>
    <v-container fluid>
      <nav-panel>
        <component :is="panelComponent"></component>
      </nav-panel>
      <component :is="viewComponent"></component>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted} from '@vue/composition-api'
import SystemNotification from '@/app/SystemNotification.vue'
import NavPanel from '@/app/NavPanel.vue'
import {PANEL_COMPONENTS, VIEW_COMPONENTS} from '@/assets/component'

export default defineComponent({
  components: {
    SystemNotification, NavPanel
  },
  setup(_props, context) {
    const viewComponent = computed(() => {
      return VIEW_COMPONENTS[context.root.$store.state.client.view]
    })

    const panelComponent = computed(() => {
      return PANEL_COMPONENTS[context.root.$store.state.client.view]
    })

    onMounted((): void => {
      if (localStorage.dark) {
        context.root.$vuetify.theme.dark = (localStorage.dark === 'true')
      }
    })

    return {viewComponent, panelComponent}
  }
})
</script>

<style>
.v-application {
  background-color: var(--v-background-base) !important;
}

.v-input__slot {
  background-color: var(--v-background-darken1) !important;
}

.dialog-item .v-input__slot {
  background-color: var(--v-background-base) !important;
}

.v-sheet {
  background-color: var(--v-background-darken1) !important;
}

.v-data-table {
  background-color: var(--v-background-darken1) !important;
}

.v-data-table tr:hover {
  background-color: var(--v-background-base) !important;
}

.v-pagination__item {
  background-color: var(--v-background-base) !important;
}

.v-pagination__item:hover {
  background-color: var(--v-primary-base) !important;
}

.v-pagination__navigation {
  background-color: var(--v-background-base) !important;
}

.v-pagination__navigation:hover {
  background-color: var(--v-primary-base) !important;
}

.v-list-item--link:hover {
  background-color: var(--v-background-base) !important;
}

.v-slider__thumb-container {
  cursor: pointer;
}
</style>
