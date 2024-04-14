<template>
  <dialog-form v-model="valid" @submit.prevent="submitChange()">
    <dialog-text-field
      label="Message ID"
      v-model.trim="adminStore.botMessageInEdit.messageId"
      append-icon="mdi-refresh"
      @click:append="adminStore.generateNewBotMessageId()"
      :rules="messageIdRules"
      :disabled="adminStore.editModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-text-field
      label="User ID"
      v-model.trim="adminStore.botMessageInEdit.userId"
      append-icon="mdi-refresh"
      @click:append="adminStore.generateNewBotMessageUserId()"
      :rules="USER_ID_RULES"
      :disabled="adminStore.deleteModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-text-field
      label="Command"
      v-model.trim="adminStore.botMessageInEdit.command"
      :rules="commandRules"
      :disabled="adminStore.deleteModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-text-field
      label="Display Name"
      v-model.trim="adminStore.botMessageInEdit.displayName"
      :rules="DISPLAY_NAME_RULES"
      :disabled="adminStore.deleteModeDisabled || disabled"
    ></dialog-text-field>
    <user-settings-avatar-select
      avatar-size="50"
      v-model.trim="adminStore.botMessageInEdit.avatar"
      :rules="AVATAR_RULES"
      :disabled="adminStore.deleteModeDisabled || disabled"
    ></user-settings-avatar-select>
    <dialog-textarea
      label="Text"
      v-model.trim="adminStore.botMessageInEdit.text"
      :rules="textRules"
      :disabled="adminStore.deleteModeDisabled || disabled"
    ></dialog-textarea>
    <dialog-actions @dialog:close="$emit('dialog:close')"></dialog-actions>
  </dialog-form>
</template>

<script setup lang="ts">
import DialogForm from '@/components/common/dialogs/DialogForm.vue';
import { ref } from 'vue';
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import { useAdminStore } from '@/plugins/store/admin';
import { canParseValue } from '@/assets/game-helpers';
import { MessageCommand, MessageId } from 'anime-quiz-shared-resources/src/models/bot-message';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import { AVATAR_RULES, DISPLAY_NAME_RULES, USER_ID_RULES } from '@/assets/form-rules';
import UserSettingsAvatarSelect from '@/components/common/dialogs/DialogAvatarSelect.vue';
import DialogTextarea from '@/components/common/dialogs/DialogTextarea.vue';
import { GameChatText } from 'anime-quiz-shared-resources/src/models/game';
import { DATABASE_EDIT_MODE } from '@/assets/constants';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources/src/events';
import { socket } from '@/plugins/socket';

const adminStore = useAdminStore();
const emit = defineEmits(['dialog:close']);

const messageIdRules = [
  (v: string): boolean | string => !!v || 'Message ID required',
  (v: string): boolean | string => canParseValue(v, MessageId) || 'Invalid Message ID'
];
const commandRules = [
  (v: string): boolean | string => !!v || 'Command required',
  (v: string): boolean | string => canParseValue(v, MessageCommand) || 'Invalid Emoji Command'
];
const textRules = [
  (v: string): boolean | string => !!v || 'Text required',
  (v: string): boolean | string => canParseValue(v, GameChatText) || 'Invalid Message Text'
];

const valid = ref(false);
const disabled = ref(false);

const CHANGE_MAP = {
  [DATABASE_EDIT_MODE.NEW]: SOCKET_EVENTS.ADMIN_NEW_BOT_MESSAGE,
  [DATABASE_EDIT_MODE.EDIT]: SOCKET_EVENTS.ADMIN_EDIT_BOT_MESSAGE,
  [DATABASE_EDIT_MODE.DELETE]: SOCKET_EVENTS.ADMIN_DELETE_BOT_MESSAGE
};

function submitChange() {
  if (valid.value) {
    disabled.value = true;
    const event = CHANGE_MAP[adminStore.editMode];
    socket.emit(event, adminStore.botMessageInEdit, (success: boolean) => {
      disabled.value = false;
      if (success) {
        emit('dialog:close');
      }
    });
  }
}
</script>
