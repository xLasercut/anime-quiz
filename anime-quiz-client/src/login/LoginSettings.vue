<template>
  <v-form v-model="state.valid" @submit="setSettings()">
    <v-card-text>
      <v-container fluid>
        <dialog-text-field
          label="Server URL"
          v-model.trim="state.serverUrl"
          :rules="state.rules"
        ></dialog-text-field>
        <dialog-actions @dialog:close="$emit('dialog:close')"></dialog-actions>
      </v-container>
    </v-card-text>
  </v-form>
</template>

<script setup lang="ts">
import DialogActions from '../components/dialog/DialogActions.vue'
import DialogTextField from '../components/dialog/DialogTextField.vue'
import {reactive} from 'vue'

const state = reactive({
  serverUrl: localStorage.GAME_SERVER || '',
  valid: false,
  rules: [
    (v: string): boolean | string => (!!v) || 'Game server required'
  ]
})

function setSettings(): void {
 if (state.valid) {
   localStorage.GAME_SERVER = state.serverUrl
   location.reload()
 }
}
</script>
