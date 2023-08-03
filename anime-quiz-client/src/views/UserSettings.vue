<template>
  <v-card variant="flat">
    <v-card-title>
      <v-row justify="center">
        <v-col cols="auto">
          <h2>User Settings</h2>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <dialog-form v-model="valid" @submit.prevent="save()">
        <dialog-text-field v-model="clientData.displayName" label="Display Name" :rules="DISPLAY_NAME_RULES" counter="20"></dialog-text-field>
        <user-settings-avatar-select :rules="AVATAR_RULES" v-model="clientData.avatar"></user-settings-avatar-select>
        <v-row justify="end" :dense="true">
          <v-col cols="auto">
            <icon-btn icon="mdi-refresh" color="warning" @click="reset()">Reset</icon-btn>
          </v-col>
          <v-col cols="auto">
            <icon-btn icon="mdi-check" color="success" type="submit">Save</icon-btn>
          </v-col>
        </v-row>
      </dialog-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import IconBtn from '@/components/common/buttons/IconBtn.vue';
import { useClientStore } from '@/plugins/store/client';
import DialogForm from '@/components/common/dialogs/DialogForm.vue';
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import UserSettingsAvatarSelect from '@/components/common/dialogs/DialogAvatarSelect.vue';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { DisplayName } from '@/assets/shared/models/user';
import { AVATAR_RULES, DISPLAY_NAME_RULES } from '@/assets/form-rules';

export default defineComponent({
  components: { UserSettingsAvatarSelect, DialogActions, DialogTextField, DialogForm, IconBtn },
  setup() {
    const clientStore = useClientStore();
    const state = reactive({
      valid: false,
      clientData: Object.assign({}, clientStore.clientData)
    });

    function isValidDisplayName(val: string): boolean {
      try {
        DisplayName.parse(val);
        return true;
      } catch {
        return false;
      }
    }

    function reset() {
      state.clientData = Object.assign({}, clientStore.clientData);
    }

    function save() {
      if (state.valid) {
        socket.emit(SOCKET_EVENTS.UPDATE_USER_SETTINGS, state.clientData);
      }
    }

    return { clientStore, ...toRefs(state), reset, save, DISPLAY_NAME_RULES, AVATAR_RULES };
  }
});
</script>
