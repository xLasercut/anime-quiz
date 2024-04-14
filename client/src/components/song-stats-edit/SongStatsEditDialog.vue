<template>
  <dialog-form v-model="valid" @submit.prevent="submitChange()">
    <dialog-text-field
      label="Song ID"
      v-model.trim="adminStore.songStatsInEdit.songId"
      :rules="SONG_ID_RULES"
      :disabled="adminStore.editModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-text-field
      label="Play Count"
      v-model.number="adminStore.songStatsInEdit.playCount"
      type="number"
      :rules="playCountRules"
      :disabled="adminStore.deleteModeDisabled || disabled"
    ></dialog-text-field>
    <dialog-actions :disabled="disabled" @dialog:close="$emit('dialog:close')"></dialog-actions>
  </dialog-form>
</template>

<script setup lang="ts">
import DialogForm from '@/components/common/dialogs/DialogForm.vue';
import { ref } from 'vue';
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import { useAdminStore } from '@/plugins/store/admin';
import { SONG_ID_RULES } from '@/assets/form-rules';
import { canParseValue } from '@/assets/game-helpers';
import { SongStatsPlayCount } from 'anime-quiz-shared-resources/src/models/song-stats';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import { DATABASE_EDIT_MODE } from '@/assets/constants';
import { SOCKET_EVENTS } from 'anime-quiz-shared-resources/src/events';
import { socket } from '@/plugins/socket';

const adminStore = useAdminStore();

const emit = defineEmits(['dialog:close']);

const valid = ref(false);
const disabled = ref(false);

function valueNotEmpty(val: number) {
  if (val === 0) {
    return true;
  }
  return !!val;
}

const playCountRules = [
  (v: number): boolean | string => valueNotEmpty(v) || 'Play Count required',
  (v: number): boolean | string => canParseValue(v, SongStatsPlayCount) || 'Invalid Play Count'
];

const CHANGE_MAP = {
  [DATABASE_EDIT_MODE.NEW]: SOCKET_EVENTS.ADMIN_NEW_SONG_STATS,
  [DATABASE_EDIT_MODE.EDIT]: SOCKET_EVENTS.ADMIN_EDIT_SONG_STATS,
  [DATABASE_EDIT_MODE.DELETE]: SOCKET_EVENTS.ADMIN_DELETE_SONG_STATS
};

function submitChange() {
  if (valid.value) {
    disabled.value = true;
    const event = CHANGE_MAP[adminStore.editMode];
    socket.emit(event, adminStore.songStatsInEdit, (success: boolean) => {
      disabled.value = false;
      if (success) {
        emit('dialog:close');
      }
    });
  }
}
</script>
