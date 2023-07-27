<template>
  <v-main>
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
          <dialog-text-field
            v-model="clientData.displayName"
            label="Display Name"
            :rules="displayNameRules"
            counter="20"
          ></dialog-text-field>
          <user-settings-avatar-select
            :rules="avatarRules"
            v-model="clientData.avatar"
          ></user-settings-avatar-select>
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
  </v-main>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import IconBtn from '@/components/common/buttons/IconBtn.vue';
import { useClientStore } from '@/plugins/store/client';
import DialogForm from '@/components/common/dialogs/DialogForm.vue';
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import UserSettingsAvatarSelect from '@/components/user-settings/UserSettingsAvatarSelect.vue';
import { ClientDisplayName } from '@/assets/shared/models/client';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';

export default defineComponent({
  components: { UserSettingsAvatarSelect, DialogActions, DialogTextField, DialogForm, IconBtn },
  setup() {
    const clientStore = useClientStore();
    const state = reactive({
      valid: false,
      clientData: Object.assign({}, clientStore.clientData),
      displayNameRules: [
        (v: string): boolean | string => !!v || 'Display name required',
        (v: string): boolean | string =>
          isValidDisplayName(v) || 'Display name can only contain: 0-9, A-Z, a-z and space',
        (v: string): boolean | string =>
          (v && v.length <= 20) || 'Display name must be under 20 characters'
      ],
      avatarRules: [(v: string): boolean | string => !!v || 'Avatar required']
    });

    function isValidDisplayName(val: string): boolean {
      try {
        ClientDisplayName.parse(val);
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

    return { clientStore, ...toRefs(state), reset, save };
  }
});
</script>
