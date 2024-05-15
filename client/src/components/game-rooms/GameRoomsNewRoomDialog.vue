<template>
  <dialog-form v-model="valid" @submit.prevent="submitChange()">
    <dialog-text-field label="Room Name" v-model.trim="roomName" :rules="roomNameRules" :disabled="disabled"></dialog-text-field>
    <dialog-actions @dialog:close="$emit('dialog:close')" :disabled="disabled"></dialog-actions>
  </dialog-form>
</template>

<script setup lang="ts">
import DialogForm from '@/components/common/dialogs/DialogForm.vue';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import { ref } from 'vue';
import { canParseValue, generateId } from '@/assets/game-helpers';
import { GameRoomId } from 'anime-quiz-shared-resources';
import { useRouter } from 'vue-router';
import { ROUTES } from '@/plugins/router/constants';

const emit = defineEmits(['dialog:close']);

const disabled = ref(false);
const valid = ref(false);
const roomIdPrefix = generateId('amq');
const roomName = ref('');
const router = useRouter();

function roomId(roomName: string): string {
  return `${roomIdPrefix}|${roomName}`;
}

const roomNameRules = [
  (v: string): boolean | string => !!v || 'Room Name required',
  (v: string): boolean | string => canParseValue(roomId(v), GameRoomId) || 'Invalid Room Name'
];

function submitChange() {
  if (valid.value) {
    emit('dialog:close');
    router.push(ROUTES.MAIN_GAME(roomId(roomName.value)));
  }
}
</script>
