<template>
  <dialog-form v-model="valid" @submit.prevent="submitChange()">
    <dialog-text-field
      label="Emoji ID"
      v-model.trim="adminStore.emojiInEdit.emojiId"
      append-icon="mdi-refresh"
      @click:append="adminStore.generateNewEmojiId()"
      :rules="emojiIdRules"
      :disabled="adminStore.editModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-text-field
      label="Command"
      v-model.trim="adminStore.emojiInEdit.command"
      :rules="emojiCommandRules"
      :disabled="adminStore.deleteModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-text-field
      label="Src"
      v-model.trim="adminStore.emojiInEdit.src"
      :rules="emojiSrcRules"
      :disabled="adminStore.deleteModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-select
      label="Type"
      v-model="adminStore.emojiInEdit.type"
      :disabled="adminStore.deleteModeDisabled || disabled"
      :items="emojiTypes"
      :rules="emojiTypeRules"
    ></dialog-select>
    <v-row :dense="true">
      <v-col cols="auto">
        <game-emoji width="30pt" :emoji="adminStore.emojiInEdit"></game-emoji>
      </v-col>
    </v-row>
    <dialog-actions @dialog:close="$emit('dialog:close')"></dialog-actions>
  </dialog-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogForm from '@/components/common/dialogs/DialogForm.vue';
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import { useAdminStore } from '@/plugins/store/admin';
import DialogSelect from '@/components/common/dialogs/DialogSelect.vue';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import GameEmoji from '@/components/common/GameEmoji.vue';
import { DATABASE_EDIT_MODE } from '@/assets/constants';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources/src/events';
import { socket } from '@/plugins/socket';
import { canParseValue } from '@/assets/game-helpers';
import { EmojiCommand, EmojiId, EmojiSrc, EmojiType } from 'anime-quiz-shared-resources/src/models/emoji';

const adminStore = useAdminStore();
const valid = ref(false);
const disabled = ref(false);
const emojiTypes = ['dec', 'img'];
const emit = defineEmits(['dialog:close']);

const emojiIdRules = [
  (v: string): boolean | string => !!v || 'Emoji ID required',
  (v: string): boolean | string => canParseValue(v, EmojiId) || 'Invalid Emoji ID'
];
const emojiCommandRules = [
  (v: string): boolean | string => !!v || 'Emoji Command required',
  (v: string): boolean | string => canParseValue(v, EmojiCommand) || 'Invalid Emoji Command'
];
const emojiTypeRules = [
  (v: string): boolean | string => !!v || 'Emoji Type required',
  (v: string): boolean | string => canParseValue(v, EmojiType) || 'Invalid Emoji Type'
];
const emojiSrcRules = [
  (v: string): boolean | string => !!v || 'Emoji Source required',
  (v: string): boolean | string => canParseValue(v, EmojiSrc) || 'Invalid Emoji Source'
];

const CHANGE_MAP = {
  [DATABASE_EDIT_MODE.NEW]: SOCKET_EVENTS.ADMIN_NEW_EMOJI,
  [DATABASE_EDIT_MODE.EDIT]: SOCKET_EVENTS.ADMIN_EDIT_EMOJI,
  [DATABASE_EDIT_MODE.DELETE]: SOCKET_EVENTS.ADMIN_DELETE_EMOJI
};

function submitChange() {
  if (valid.value) {
    disabled.value = true;
    const event = CHANGE_MAP[adminStore.editMode];
    socket.emit(event, adminStore.emojiInEdit, (success: boolean) => {
      disabled.value = false;
      if (success) {
        emit('dialog:close');
      }
    });
  }
}
</script>
