<template>
  <dialog-form v-model="valid" @submit.prevent="submitChange()">
    <dialog-slider label="Song Count" v-model="settings.songCount" :min="1" :max="100"></dialog-slider>
    <dialog-slider label="Guess Time" v-model="settings.guessTime" :min="5" :max="120"></dialog-slider>
    <dialog-radio label="Duplicate" v-model="settings.duplicate">
      <v-radio label="True" :value="true"></v-radio>
      <v-radio label="False" :value="false"></v-radio>
    </dialog-radio>
    <dialog-select label="Game Mode" v-model="settings.gameMode"></dialog-select>
  </dialog-form>
</template>

<script setup lang="ts">
import { GameRoomSettingsType } from '@/assets/shared/models/types';
import { ref } from 'vue';
import { GAME_MODES } from '@/assets/shared/game-modes';
import DialogForm from '@/components/common/dialogs/DialogForm.vue';
import DialogSlider from '@/components/common/dialogs/DialogSlider.vue';
import DialogRadio from '@/components/common/dialogs/DialogRadio.vue';
import DialogSelect from "@/components/common/dialogs/DialogSelect.vue";

const settings = ref<GameRoomSettingsType>({
  songCount: 20,
  guessTime: 30,
  duplicate: false,
  gameMode: GAME_MODES.NORMAL
});
const valid = ref(false);

function submitChange() {}
</script>
