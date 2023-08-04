<template>
  <dialog-form v-model="valid" @submit.prevent="submitChange()">
    <dialog-text-field
      label="Emoji ID"
      v-model.trim="adminStore.emojiInEdit.emojiId"
      append-icon="mdi-refresh"
      @click:append="adminStore.generateNewEmojiId()"
      :rules="EMOJI_ID_RULES"
      :disabled="adminStore.editModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-text-field
      label="Command"
      v-model.trim="adminStore.emojiInEdit.command"
      :rules="EMOJI_COMMAND_RULES"
      :disabled="adminStore.deleteModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-text-field
      label="Src"
      v-model.trim="adminStore.emojiInEdit.src"
      :rules="EMOJI_SRC_RULES"
      :disabled="adminStore.deleteModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-select
      label="Type"
      v-model="adminStore.emojiInEdit.type"
      :disabled="adminStore.deleteModeDisabled || disabled"
      :items="emojiTypes"
      :rules="EMOJI_TYPE_RULES"
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
import { EMOJI_COMMAND_RULES, EMOJI_ID_RULES, EMOJI_SRC_RULES, EMOJI_TYPE_RULES } from '@/assets/form-rules';
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import { useAdminStore } from '@/plugins/store/admin';
import DialogSelect from '@/components/common/dialogs/DialogSelect.vue';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import GameEmoji from '@/components/common/GameEmoji.vue';

const adminStore = useAdminStore();
const valid = ref(false);
const disabled = ref(false);
const emojiTypes = ['dec', 'img'];

function submitChange() {}
</script>
