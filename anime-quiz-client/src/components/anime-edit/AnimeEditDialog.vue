<template>
  <dialog-form v-model="valid" @submit.prevent="submitChange()">
    <dialog-text-field
      label="Anime ID"
      v-model.trim="adminStore.animeInEdit.animeId"
      append-icon="mdi-refresh"
      @click:append="adminStore.generateNewAnimeId()"
      :rules="ANIME_ID_RULES"
      :disabled="adminStore.editModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-multi-combobox
      v-model="adminStore.animeInEdit.animeName"
      :disabled="adminStore.deleteModeDisabled || disabled"
      :rules="ANIME_NAME_RULES"
    ></dialog-multi-combobox>
    <dialog-actions @dialog:close="$emit('dialog:close')" :disabled="disabled"></dialog-actions>
  </dialog-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogForm from '@/components/common/dialogs/DialogForm.vue';
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import { useAdminStore } from '@/plugins/store/admin';
import { ANIME_ID_RULES, ANIME_NAME_RULES } from '@/assets/form-rules';
import DialogMultiCombobox from '@/components/common/dialogs/DialogMultiCombobox.vue';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import { DATABASE_EDIT_MODE } from '@/assets/constants';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { socket } from '@/plugins/socket';

const adminStore = useAdminStore();
const valid = ref(false);
const disabled = ref(false);
const emit = defineEmits(['dialog:close']);

const CHANGE_MAP = {
  [DATABASE_EDIT_MODE.NEW]: SOCKET_EVENTS.ADMIN_NEW_ANIME,
  [DATABASE_EDIT_MODE.EDIT]: SOCKET_EVENTS.ADMIN_EDIT_ANIME,
  [DATABASE_EDIT_MODE.DELETE]: SOCKET_EVENTS.ADMIN_DELETE_ANIME
};

function submitChange() {
  if (valid.value) {
    disabled.value = true;
    const event = CHANGE_MAP[adminStore.editMode];
    socket.emit(event, adminStore.animeInEdit, (success: boolean) => {
      disabled.value = false;
      if (success) {
        emit('dialog:close');
      }
    });
  }
}
</script>
