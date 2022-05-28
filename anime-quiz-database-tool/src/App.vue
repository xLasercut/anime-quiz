<template>
  <v-app>
    <v-app>
      <nav-bar></nav-bar>
      <v-container fluid>
        <component :is="viewComponent()"></component>
      </v-container>
    </v-app>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { viewComponent } from './plugins/routing/mapping'
import NavBar from './components/app/NavBar.vue'

export default defineComponent({
  components: { NavBar },
  setup() {
    return {
      viewComponent
    }
  }
})
</script>

<style>
.v-application {
  background-color: var(--v-background-base) !important;
}

.v-sheet {
  background-color: var(--v-background-darken1) !important;
}

.v-data-table {
  background-color: var(--v-background-darken1) !important;
}

.v-data-table th {
  background-color: var(--v-background-darken1) !important;
}

.v-data-table tr:hover {
  background-color: var(--v-background-darken2) !important;
}

.v-data-table .v-data-table__selected {
  background-color: var(--v-background-darken2) !important;
}

.v-pagination__item {
  background-color: var(--v-background-base) !important;
}

.v-pagination__item:hover {
  background-color: var(--v-background-darken1) !important;
}

.v-pagination__navigation {
  background-color: var(--v-background-base) !important;
}

.v-pagination__navigation:hover {
  background-color: var(--v-background-darken1) !important;
}
</style>
