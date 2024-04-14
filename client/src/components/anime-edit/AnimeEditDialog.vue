<template>
  <dialog-form v-model="valid" @submit.prevent="submitChange()">
    <dialog-text-field
      label="Anime ID"
      v-model.trim="adminStore.animeInEdit.animeId"
      append-icon="mdi-refresh"
      @click:append="adminStore.generateNewAnimeId()"
      :rules="animeIdRules"
      :disabled="adminStore.editModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-multi-combobox
      v-model="adminStore.animeInEdit.animeName"
      :disabled="adminStore.deleteModeDisabled || disabled"
      :rules="animeNameRules"
    ></dialog-multi-combobox>
    <dialog-actions @dialog:close="$emit('dialog:close')" :disabled="disabled"></dialog-actions>
  </dialog-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogForm from '@/components/common/dialogs/DialogForm.vue';
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import { useAdminStore } from '@/plugins/store/admin';
import DialogMultiCombobox from '@/components/common/dialogs/DialogMultiCombobox.vue';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import { DATABASE_EDIT_MODE } from '@/assets/constants';
import { AnimeId, AnimeName, SOCKET_EVENTS } from 'anime-quiz-shared-resources';
import { socket } from '@/plugins/socket';
import { canParseValue } from '@/assets/game-helpers';
import { z } from 'zod';

const adminStore = useAdminStore();
const valid = ref(false);
const disabled = ref(false);
const emit = defineEmits(['dialog:close']);

const animeIdRules = [
  (v: string): boolean | string => !!v || 'Anime ID required',
  (v: string): boolean | string => canParseValue(v, AnimeId) || 'Invalid Anime ID'
];
const animeNameRules = [
  (v: string[]): boolean | string => v.length > 0 || 'Anime name required',
  (v: string[]): boolean | string => canParseValue(v, z.array(AnimeName)) || 'Invalid anime name'
];

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
