<template>
  <dialog-form v-model="valid" @submit.prevent="newUser()">
    <dialog-text-field
      label="Discord ID"
      v-model.trim="adminStore.userInEdit.discordId"
      :rules="DISCORD_ID_RULES"
      :disabled="disabled"
    ></dialog-text-field>
    <dialog-text-field
      label="User ID"
      v-model.trim="adminStore.userInEdit.userId"
      append-icon="mdi-refresh"
      @click:append="adminStore.generateNewUserId()"
      :rules="USER_ID_RULES"
      :disabled="disabled"
    ></dialog-text-field>
    <dialog-text-field
      label="Display Name"
      v-model.trim="adminStore.userInEdit.displayName"
      :rules="DISPLAY_NAME_RULES"
      :disabled="disabled"
    ></dialog-text-field>
    <user-settings-avatar-select
      avatar-size="50"
      v-model.trim="adminStore.userInEdit.avatar"
      :rules="AVATAR_RULES"
      :disabled="disabled"
    ></user-settings-avatar-select>
    <dialog-radio
      label="Admin"
      v-model="adminStore.userInEdit.admin"
      :rules="ADMIN_RULES"
      :disabled="disabled"
    >
      <v-radio label="True" :value="true"></v-radio>
      <v-radio label="False" :value="false"></v-radio>
    </dialog-radio>
    <dialog-actions :disabled="disabled" @dialog:close="$emit('dialog:close')"></dialog-actions>
  </dialog-form>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import DialogForm from '@/components/common/dialogs/DialogForm.vue';
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import UserSettingsAvatarSelect from '@/components/common/dialogs/DialogAvatarSelect.vue';
import DialogSelect from '@/components/common/dialogs/DialogSelect.vue';
import DialogRadio from '@/components/common/dialogs/DialogRadio.vue';
import { useAdminStore } from '@/plugins/store/admin';
import {
  ADMIN_RULES,
  AVATAR_RULES,
  DISCORD_ID_RULES,
  DISPLAY_NAME_RULES,
  USER_ID_RULES
} from '@/assets/form-rules';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { User } from '@/assets/shared/models/user';

export default defineComponent({
  components: {
    DialogActions,
    DialogRadio,
    DialogSelect,
    UserSettingsAvatarSelect,
    DialogTextField,
    DialogForm
  },
  setup(_props, context) {
    const adminStore = useAdminStore();
    const state = reactive({
      valid: false,
      disabled: false
    });

    function newUser() {
      if (state.valid) {
        state.disabled = true;
        socket.emit(
          SOCKET_EVENTS.ADMIN_NEW_USER,
          User.parse(adminStore.userInEdit),
          (success: boolean) => {
            state.disabled = false;
            if (success) {
              context.emit('dialog:close');
            }
          }
        );
      }
    }

    return {
      ...toRefs(state),
      adminStore,
      DISCORD_ID_RULES,
      DISPLAY_NAME_RULES,
      AVATAR_RULES,
      USER_ID_RULES,
      ADMIN_RULES,
      newUser
    };
  }
});
</script>
