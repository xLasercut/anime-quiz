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
import { GameRoomId } from '@/assets/shared/models/game';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { useClientStore } from '@/plugins/store/client';
import { ROUTES } from '@/assets/routing/routes';

const emit = defineEmits(['dialog:close']);

const clientStore = useClientStore();
const disabled = ref(false);
const valid = ref(false);
const roomIdPrefix = generateId('amq');
const roomName = ref('');

function roomId(roomName: string): string {
  return `${roomIdPrefix}|${roomName}`;
}

const roomNameRules = [
  (v: string): boolean | string => !!v || 'Room Name required',
  (v: string): boolean | string => canParseValue(roomId(v), GameRoomId) || 'Invalid Room Name'
];

function submitChange() {
  if (valid.value) {
    disabled.value = true;
    socket.emit(SOCKET_EVENTS.NEW_GAME_ROOM, roomId(roomName.value), (success: boolean) => {
      disabled.value = false;
      if (success) {
        emit('dialog:close');
        clientStore.changeView(ROUTES.MAIN_GAME);
      }
    });
  }
}
</script>
