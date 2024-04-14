<template>
  <dialog-form v-model="valid" @submit.prevent="submitChange()">
    <dialog-text-field
      label="Discord ID"
      v-model.trim="adminStore.userInEdit.discordId"
      :rules="DISCORD_ID_RULES"
      :disabled="adminStore.editModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-text-field
      label="User ID"
      v-model.trim="adminStore.userInEdit.userId"
      append-icon="mdi-refresh"
      @click:append="adminStore.generateNewUserId()"
      :rules="USER_ID_RULES"
      :disabled="adminStore.editModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-text-field
      label="Display Name"
      v-model.trim="adminStore.userInEdit.displayName"
      :rules="DISPLAY_NAME_RULES"
      :disabled="adminStore.deleteModeDisabled || disabled"
    ></dialog-text-field>
    <user-settings-avatar-select
      avatar-size="50"
      v-model.trim="adminStore.userInEdit.avatar"
      :rules="AVATAR_RULES"
      :disabled="adminStore.deleteModeDisabled || disabled"
    ></user-settings-avatar-select>
    <dialog-toggle
      label="Admin"
      v-model="adminStore.userInEdit.admin"
      :rules="ADMIN_RULES"
      :disabled="adminStore.deleteModeDisabled || disabled"
    >
    </dialog-toggle>
    <dialog-actions :disabled="disabled" @dialog:close="$emit('dialog:close')"></dialog-actions>
  </dialog-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogForm from '@/components/common/dialogs/DialogForm.vue';
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import UserSettingsAvatarSelect from '@/components/common/dialogs/DialogAvatarSelect.vue';
import { useAdminStore } from '@/plugins/store/admin';
import { ADMIN_RULES, AVATAR_RULES, DISCORD_ID_RULES, DISPLAY_NAME_RULES, USER_ID_RULES } from '@/assets/form-rules';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources/src/events';
import { User } from 'anime-quiz-shared-resources/src/models/user';
import { DATABASE_EDIT_MODE } from '@/assets/constants';
import DialogToggle from '@/components/common/dialogs/DialogToggle.vue';

const adminStore = useAdminStore();
const valid = ref(false);
const disabled = ref(false);
const emit = defineEmits(['dialog:close']);

const CHANGE_MAP = {
  [DATABASE_EDIT_MODE.NEW]: SOCKET_EVENTS.ADMIN_NEW_USER,
  [DATABASE_EDIT_MODE.EDIT]: SOCKET_EVENTS.ADMIN_EDIT_USER,
  [DATABASE_EDIT_MODE.DELETE]: SOCKET_EVENTS.ADMIN_DELETE_USER
};

function submitChange() {
  if (valid.value) {
    disabled.value = true;
    const event = CHANGE_MAP[adminStore.editMode];
    socket.emit(event, User.parse(adminStore.userInEdit), (success: boolean) => {
      disabled.value = false;
      if (success) {
        emit('dialog:close');
      }
    });
  }
}
</script>
