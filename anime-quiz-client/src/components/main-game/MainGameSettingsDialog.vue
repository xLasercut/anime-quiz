<template>
  <dialog-form v-model="valid" @submit.prevent="submitChange()">
    <dialog-slider
      :disabled="disabled"
      label="Song Count"
      v-model="settings.songCount"
      :min="1"
      :max="100"
      :rules="songCountRules"
    ></dialog-slider>
    <dialog-slider
      :disabled="disabled"
      label="Guess Time"
      v-model="settings.guessTime"
      :min="5"
      :max="120"
      :rules="guessTimeRules"
    ></dialog-slider>
    <dialog-radio :disabled="disabled" label="Duplicate" v-model="settings.duplicate" :rules="duplicateRules">
      <v-radio label="True" :value="true"></v-radio>
      <v-radio label="False" :value="false"></v-radio>
    </dialog-radio>
    <dialog-select
      :disabled="disabled"
      label="Game Mode"
      v-model="settings.gameMode"
      :items="gameModeItems"
      :rules="gameModeRules"
    ></dialog-select>
    <dialog-actions :disabled="disabled" @dialog:close="$emit('dialog:close')"></dialog-actions>
  </dialog-form>
</template>

<script setup lang="ts">
import { GameRoomSettingsType } from '@/assets/shared/models/types';
import { onUnmounted, ref } from 'vue';
import { GAME_MODES } from '@/assets/shared/game-modes';
import DialogForm from '@/components/common/dialogs/DialogForm.vue';
import DialogSlider from '@/components/common/dialogs/DialogSlider.vue';
import DialogRadio from '@/components/common/dialogs/DialogRadio.vue';
import DialogSelect from '@/components/common/dialogs/DialogSelect.vue';
import { socket } from '@/plugins/socket';
import { SOCKET_EVENTS } from '@/assets/shared/events';
import {
  GameRoomSettings,
  GameRoomSettingsGameMode,
  GameRoomSettingsGuessTime,
  GameRoomSettingSongCount
} from '@/assets/shared/models/game';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import { canParseValue } from '@/assets/game-helpers';
import { z } from 'zod';

const emit = defineEmits(['dialog:close']);

const settings = ref<GameRoomSettingsType>({
  songCount: 20,
  guessTime: 30,
  duplicate: false,
  gameMode: GAME_MODES.NORMAL
});

const valid = ref(false);
const disabled = ref(false);
const gameModeItems = Object.values(GAME_MODES);
const songCountRules = [
  (v: number): boolean | string => !!v || 'Song Count cannot be blank',
  (v: number): boolean | string => canParseValue(v, GameRoomSettingSongCount) || 'Invalid Song Count'
];
const guessTimeRules = [
  (v: number): boolean | string => !!v || 'Guess Time cannot be blank',
  (v: number): boolean | string => canParseValue(v, GameRoomSettingsGuessTime) || 'Invalid Guess Time'
];
const duplicateRules = [(v: boolean): boolean | string => canParseValue(v, z.boolean()) || 'Invalid Duplicate'];
const gameModeRules = [
  (v: string): boolean | string => !!v || 'Game Mode cannot be blank',
  (v: string): boolean | string => canParseValue(v, GameRoomSettingsGameMode) || 'Invalid Game Mode'
];

socket.on(SOCKET_EVENTS.UPDATE_CLIENT_GAME_ROOM_SETTINGS, (_settings: GameRoomSettingsType) => {
  settings.value = GameRoomSettings.parse(_settings);
});

onUnmounted(() => {
  socket.off(SOCKET_EVENTS.UPDATE_CLIENT_GAME_ROOM_SETTINGS);
});

function submitChange() {
  if (valid.value) {
    socket.emit(SOCKET_EVENTS.UPDATE_SERVER_GAME_ROOM_SETTINGS, settings.value);
    emit('dialog:close');
  }
}
</script>
