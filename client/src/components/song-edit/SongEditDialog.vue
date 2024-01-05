<template>
  <dialog-form v-model="valid" @submit.prevent="submitChange()">
    <dialog-text-field
      label="Song ID"
      v-model.trim="adminStore.songInEdit.songId"
      append-icon="mdi-refresh"
      @click:append="adminStore.generateNewSongId()"
      :rules="songIdRules"
      :disabled="adminStore.editModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-multi-autocomplete
      v-model="adminStore.songInEdit.animeId"
      :disabled="adminStore.deleteModeDisabled || disabled"
      :items="dataStore.animeStringList"
      item-title="animeName"
      item-value="animeId"
      :custom-filter="customFilter"
      :rules="songAnimeIdRules"
      label="Anime"
    ></dialog-multi-autocomplete>
    <dialog-text-field
      label="Title"
      v-model.trim="adminStore.songInEdit.songTitle"
      :rules="songTitleRules"
      :disabled="adminStore.deleteModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-text-field
      label="Src"
      v-model.trim="adminStore.songInEdit.src"
      :rules="songSrcRules"
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
      :rules="songTypeRules"
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
import DialogMultiAutocomplete from '@/components/common/dialogs/DialogMultiAutocomplete.vue';
import { useDataStore } from '@/plugins/store/data';
import { canParseValue, isMatchFilter } from '@/assets/game-helpers';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import { DATABASE_EDIT_MODE } from '@/assets/constants';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import { socket } from '@/plugins/socket';
import { SongId, SongSrc, SongTitle, SongType } from '@/assets/shared/models/song';
import { z } from 'zod';
import { AnimeId } from '@/assets/shared/models/anime';

const adminStore = useAdminStore();
const dataStore = useDataStore();
const valid = ref(false);
const disabled = ref(false);
const songTypes = ['OP', 'ED', 'INSERT'];
const emit = defineEmits(['dialog:close']);

const songIdRules = [
  (v: string): boolean | string => !!v || 'Song ID required',
  (v: string): boolean | string => canParseValue(v, SongId) || 'Invalid Song ID'
];
const songTitleRules = [
  (v: string): boolean | string => !!v || 'Song Title required',
  (v: string): boolean | string => canParseValue(v, SongTitle) || 'Invalid Song Title'
];
const songSrcRules = [
  (v: string): boolean | string => !!v || 'Song Source required',
  (v: string): boolean | string => canParseValue(v, SongSrc) || 'Invalid Song Source'
];
const songTypeRules = [
  (v: string): boolean | string => !!v || 'Song Type required',
  (v: string): boolean | string => canParseValue(v, SongType) || 'Invalid Type Source'
];
const songAnimeIdRules = [
  (v: string[]): boolean | string => v.length > 0 || 'Anime required',
  (v: string[]): boolean | string => canParseValue(v, z.array(AnimeId)) || 'Invalid anime'
];

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
