<template>
  <dialog-form v-model="valid" @submit.prevent="setSettings()">
    <dialog-text-field label="Server URL" v-model.trim="serverUrl" :rules="rules"></dialog-text-field>
    <dialog-actions @dialog:close="$emit('dialog:close')"></dialog-actions>
  </dialog-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import DialogForm from '@/components/common/dialogs/DialogForm.vue';

const valid = ref(false);
const serverUrl = ref(localStorage[LOCAL_STORAGE_CONSTANTS.GAME_SERVER] || '');
const rules = [(v: string): boolean | string => !!v || 'Game server required'];

function setSettings() {
  if (valid.value) {
    localStorage[LOCAL_STORAGE_CONSTANTS.GAME_SERVER] = serverUrl.value;
    location.reload();
  }
}
</script>
