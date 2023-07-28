<template>
  <v-row :dense="true">
    <v-col>
      <custom-combobox
        :clearable="clearable"
        :variant="variant"
        :density="density"
        label="Anime"
        :items="dataStore.animeNames"
        :model-value="anime"
        @update:model-value="$emit('update:anime', $event)"
      ></custom-combobox>
    </v-col>
    <v-col>
      <custom-combobox
        :clearable="clearable"
        :variant="variant"
        :density="density"
        label="Song Title"
        :items="dataStore.songTitles"
        :model-value="title"
        @update:model-value="$emit('update:title', $event)"
      ></custom-combobox>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useDataStore } from '@/plugins/store/data';
import CustomCombobox from '@/components/common/inputs/CustomCombobox.vue';

export default defineComponent({
  components: { CustomCombobox },
  props: {
    anime: {
      required: true,
      type: String
    },
    title: {
      required: true,
      type: String
    }
  },
  setup() {
    const dataStore = useDataStore();
    const state = reactive({
      density: 'compact',
      variant: 'outlined',
      clearable: true
    });

    return { dataStore, ...toRefs(state) };
  }
});
</script>
