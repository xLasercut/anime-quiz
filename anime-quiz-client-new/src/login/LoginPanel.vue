<template>
  <q-btn
    flat
    stretch
    color="primary"
    icon-right="mdi-cog"
    @click="openSettings()"
    label="Settings"
  ></q-btn>
</template>

<script setup lang="ts">
import {inject} from 'vue'
import {CLIENT_EVENTS} from '../assets/events'
import {DIALOG_ROUTES} from '../plugins/routing/routes'

const openDialog = inject<Function>(CLIENT_EVENTS.OPEN_DIALOG)

function openSettings(): void {
  if (openDialog) {
    openDialog(DIALOG_ROUTES.LOGIN_SETTINGS, 'Settings')
  }
}

</script>
