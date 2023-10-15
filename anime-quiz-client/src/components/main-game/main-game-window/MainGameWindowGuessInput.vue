<template>
  <v-row>
    <v-col cols="12" sm="6">
      <custom-combobox
        label="Anime"
        :items="dataStore.animeNames"
        v-model.trim="guessInput.anime"
        persistent-hint
        :hint="`Selected Anime: ${guessInput.anime}`"
        variant="solo"
        flat
      ></custom-combobox>
    </v-col>
    <v-col cols="12" sm="6">
      <custom-combobox
        label="Song Title"
        :items="dataStore.songTitles"
        v-model.trim="guessInput.title"
        :hint="`Selected Song Title: ${guessInput.title}`"
        persistent-hint
        variant="solo"
        flat
      ></custom-combobox>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import CustomCombobox from '@/components/common/inputs/CustomCombobox.vue';
import { ref } from 'vue';
import { useDataStore } from '@/plugins/store/data';

const dataStore = useDataStore();

const guessInput = ref({
  anime: '',
  title: ''
});
</script>
