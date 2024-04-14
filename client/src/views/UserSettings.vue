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
        <dialog-text-field
          v-model="clientData.displayName"
          label="Display Name"
          :rules="DISPLAY_NAME_RULES"
          counter="20"
        ></dialog-text-field>
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

<script setup lang="ts">
import { ref } from 'vue';
import IconBtn from '@/components/common/buttons/IconBtn.vue';
import { useClientStore } from '@/plugins/store/client';
import DialogForm from '@/components/common/dialogs/DialogForm.vue';
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import UserSettingsAvatarSelect from '@/components/common/dialogs/DialogAvatarSelect.vue';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources';
import { AVATAR_RULES, DISPLAY_NAME_RULES } from '@/assets/form-rules';

const clientStore = useClientStore();
const valid = ref(false);
const clientData = ref(Object.assign({}, clientStore.clientData));

function reset() {
  clientData.value = Object.assign({}, clientStore.clientData);
}

function save() {
  if (valid.value) {
    socket.emit(SOCKET_EVENTS.UPDATE_USER_SETTINGS, clientData.value);
  }
}
</script>
