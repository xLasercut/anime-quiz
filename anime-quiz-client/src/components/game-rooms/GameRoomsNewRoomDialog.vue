<template>
  <dialog-form v-model="valid" @submit.prevent="submitChange()">
    <dialog-text-field
      label="Room ID"
      v-model.trim="roomId"
      append-icon="mdi-refresh"
      @click:append="generateRoomId()"
      :rules="roomIdRules"
      :disabled="disabled"
    ></dialog-text-field>
    <dialog-text-field label="Room Name" v-model.trim="roomName" :rules="roomNameRules" :disabled="disabled"></dialog-text-field>
    <dialog-actions @dialog:close="$emit('dialog:close')" :disabled="disabled"></dialog-actions>
  </dialog-form>
</template>

<script setup lang="ts">
import DialogForm from '@/components/common/dialogs/DialogForm.vue';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import { ref } from 'vue';
import { generateId } from '@/assets/game-helpers';

const disabled = ref(false);
const valid = ref(false);
const roomId = ref('');
const roomName = ref('');

function generateRoomId() {
  roomId.value = generateId('amq');
}

const roomIdRules = [];
const roomNameRules = [];

function submitChange() {}

generateRoomId();
</script>
