<template>
  <dialog-form v-model="valid" @submit.prevent="submitChange()">
    <dialog-slider
      :disabled="settingsDisabled()"
      label="Song Count"
      v-model="settings.songCount"
      :min="1"
      :max="100"
      :rules="songCountRules"
    ></dialog-slider>
    <dialog-slider
      :disabled="settingsDisabled()"
      label="Guess Time"
      v-model="settings.guessTime"
      :min="5"
      :max="120"
      :rules="guessTimeRules"
    ></dialog-slider>
    <dialog-slider
      :disabled="settingsDisabled()"
      label="Video Load Wait Time"
      v-model="settings.loadTime"
      :min="5"
      :max="60"
      :rules="loadTimeRules"
    ></dialog-slider>
    <dialog-toggle :disabled="settingsDisabled()" label="Duplicate" v-model="settings.duplicate" :rules="duplicateRules"></dialog-toggle>
    <dialog-toggle
      :disabled="settingsDisabled()"
      label="Least Played"
      v-model="settings.leastPlayed"
      :rules="leastPlayedRules"
    ></dialog-toggle>
    <dialog-select
      :disabled="settingsDisabled()"
      label="Game Mode"
      v-model="settings.gameMode"
      :items="gameModeItems"
      :rules="gameModeRules"
    ></dialog-select>
    <dialog-select
      :disabled="settingsDisabled()"
      label="Song Type"
      v-model="settings.songType"
      :items="songTypeItems"
      :rules="songTypeRules"
      :multiple="true"
    ></dialog-select>
    <dialog-actions :disabled="settingsDisabled()" @dialog:close="$emit('dialog:close')"></dialog-actions>
  </dialog-form>
</template>

<script setup lang="ts">
import {
  GAME_MODES,
  GameRoomSettings,
  GameRoomSettingsGameMode,
  GameRoomSettingsGuessTime,
  GameRoomSettingsLoadTime,
  GameRoomSettingSongCount,
  GameRoomSettingsSongType,
  SOCKET_EVENTS,
  SONG_TYPES,
  TGameRoomSettings
} from 'anime-quiz-shared-resources';
import { onUnmounted, ref } from 'vue';
import DialogForm from '@/components/common/dialogs/DialogForm.vue';
import DialogSlider from '@/components/common/dialogs/DialogSlider.vue';
import DialogSelect from '@/components/common/dialogs/DialogSelect.vue';
import { socket } from '@/plugins/socket';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import { canParseValue } from '@/assets/game-helpers';
import { z } from 'zod';
import { useClientStore } from '@/plugins/store/client';
import { useGameStore } from '@/plugins/store/game';
import DialogToggle from '@/components/common/dialogs/DialogToggle.vue';

const clientStore = useClientStore();
const gameStore = useGameStore();

const emit = defineEmits(['dialog:close']);

const settings = ref<TGameRoomSettings>({
  songCount: 20,
  guessTime: 30,
  loadTime: 10,
  duplicate: false,
  leastPlayed: false,
  gameMode: GAME_MODES.NORMAL,
  songType: Object.values(SONG_TYPES)
});

const valid = ref(false);
const disabled = ref(false);
const gameModeItems = Object.values(GAME_MODES);
const songTypeItems = Object.values(SONG_TYPES);
const songCountRules = [
  (v: number): boolean | string => !!v || 'Song Count cannot be blank',
  (v: number): boolean | string => canParseValue(v, GameRoomSettingSongCount) || 'Invalid Song Count'
];
const guessTimeRules = [
  (v: number): boolean | string => !!v || 'Guess Time cannot be blank',
  (v: number): boolean | string => canParseValue(v, GameRoomSettingsGuessTime) || 'Invalid Guess Time'
];
const loadTimeRules = [
  (v: number): boolean | string => !!v || 'Video Load Wait Time cannot be blank',
  (v: number): boolean | string => canParseValue(v, GameRoomSettingsLoadTime) || 'Invalid Video Load Wait Time'
];
const duplicateRules = [(v: boolean): boolean | string => canParseValue(v, z.boolean()) || 'Invalid Duplicate'];
const leastPlayedRules = [(v: boolean): boolean | string => canParseValue(v, z.boolean()) || 'Invalid Least Played'];
const gameModeRules = [
  (v: string): boolean | string => !!v || 'Game Mode cannot be blank',
  (v: string): boolean | string => canParseValue(v, GameRoomSettingsGameMode) || 'Invalid Game Mode'
];
const songTypeRules = [
  (v: string): boolean | string => v.length > 0 || 'Song type cannot be blank',
  (v: string): boolean | string => canParseValue(v, GameRoomSettingsSongType) || 'Invalid Song Type'
];

socket.on(SOCKET_EVENTS.UPDATE_CLIENT_GAME_ROOM_SETTINGS, (_settings: TGameRoomSettings) => {
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

function settingsDisabled(): boolean {
  return disabled.value || (!clientStore.clientData.host && !clientStore.clientData.admin) || gameStore.playing;
}
</script>
