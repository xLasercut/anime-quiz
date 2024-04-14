<template>
  <dialog-form v-model="valid" @submit.prevent="submitChange()">
    <dialog-text-field
      label="Song ID"
      v-model.trim="adminStore.songInEdit.songId"
      append-icon="mdi-refresh"
      @click:append="adminStore.generateNewSongId()"
      :rules="SONG_ID_RULES"
      :disabled="adminStore.editModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-multi-anime-autocomplete
      v-model="adminStore.songInEdit.animeId"
      :disabled="adminStore.deleteModeDisabled || disabled"
    ></dialog-multi-anime-autocomplete>
    <dialog-text-field
      label="Title"
      v-model.trim="adminStore.songInEdit.songTitle"
      :rules="SONG_TITLE_RULES"
      :disabled="adminStore.deleteModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-text-field
      label="Src"
      v-model.trim="adminStore.songInEdit.src"
      :rules="SONG_SRC_RULES"
      :disabled="adminStore.deleteModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-text-field
      label="Audio Src"
      v-model.trim="adminStore.songInEdit.audioSrc"
      :disabled="adminStore.deleteModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-text-field
      label="Artist"
      v-model.trim="adminStore.songInEdit.artist"
      :disabled="adminStore.deleteModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-select
      label="Type"
      v-model.trim="adminStore.songInEdit.type"
      :disabled="adminStore.deleteModeDisabled || disabled"
      :items="songTypes"
      :rules="SONG_TYPE_RULES"
    ></dialog-select>
    <dialog-actions :disabled="disabled" @dialog:close="$emit('dialog:close')"></dialog-actions>
  </dialog-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogForm from '@/components/common/dialogs/DialogForm.vue';
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import { useAdminStore } from '@/plugins/store/admin';
import DialogSelect from '@/components/common/dialogs/DialogSelect.vue';
import DialogMultiAnimeAutocomplete from '@/components/common/dialogs/DialogMultiAnimeAutocomplete.vue';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import { DATABASE_EDIT_MODE } from '@/assets/constants';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources/src/events';
import { socket } from '@/plugins/socket';
import { SONG_TYPES } from 'anime-quiz-shared-resources/src/song-types';
import { SONG_ID_RULES, SONG_SRC_RULES, SONG_TITLE_RULES, SONG_TYPE_RULES } from '@/assets/form-rules';

const adminStore = useAdminStore();
const valid = ref(false);
const disabled = ref(false);
const songTypes = Object.values(SONG_TYPES);
const emit = defineEmits(['dialog:close']);

const CHANGE_MAP = {
  [DATABASE_EDIT_MODE.NEW]: SOCKET_EVENTS.ADMIN_NEW_SONG,
  [DATABASE_EDIT_MODE.EDIT]: SOCKET_EVENTS.ADMIN_EDIT_SONG,
  [DATABASE_EDIT_MODE.DELETE]: SOCKET_EVENTS.ADMIN_DELETE_SONG
};

function submitChange() {
  if (valid.value) {
    disabled.value = true;
    const event = CHANGE_MAP[adminStore.editMode];
    socket.emit(event, adminStore.songInEdit, (success: boolean) => {
      disabled.value = false;
      if (success) {
        emit('dialog:close');
      }
    });
  }
}
</script>
