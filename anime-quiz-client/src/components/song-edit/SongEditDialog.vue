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
    <dialog-multi-autocomplete
      v-model="adminStore.songInEdit.animeId"
      :disabled="adminStore.deleteModeDisabled || disabled"
      :items="dataStore.animeStringList"
      item-title="animeName"
      item-value="animeId"
      :custom-filter="customFilter"
      :rules="SONG_ANIME_ID_RULES"
      label="Anime"
    ></dialog-multi-autocomplete>
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
import { SONG_ANIME_ID_RULES, SONG_ID_RULES, SONG_SRC_RULES, SONG_TITLE_RULES, SONG_TYPE_RULES } from '@/assets/form-rules';
import DialogSelect from '@/components/common/dialogs/DialogSelect.vue';
import DialogMultiAutocomplete from '@/components/common/dialogs/DialogMultiAutocomplete.vue';
import { useDataStore } from '@/plugins/store/data';
import { isMatchFilter } from '@/assets/game-helpers';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import { DATABASE_EDIT_MODE } from '@/assets/constants';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { socket } from '@/plugins/socket';

const adminStore = useAdminStore();
const dataStore = useDataStore();
const valid = ref(false);
const disabled = ref(false);
const songTypes = ['OP', 'ED', 'INSERT'];
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

function customFilter(value: string, query: string) {
  return isMatchFilter(query, value);
}
</script>
