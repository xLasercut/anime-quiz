<template>
  <v-row :dense="true">
    <v-col>
      <table-filter-text-field label="Anime ID" :model-value="animeId" @update:model-value="updateAnimeId($event)"></table-filter-text-field>
    </v-col>
    <v-col>
      <table-filter-combobox
        label="Anime Name"
        :items="dataStore.animeNames"
        :model-value="animeName"
        @update:model-value="updateAnimeName($event)"
      ></table-filter-combobox>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import TableFilterTextField from '@/components/common/tables/TableFilterTextField.vue';
import TableFilterCombobox from '@/components/common/tables/TableFilterCombobox.vue';
import { AnimeIdType } from '@/assets/shared/models/types';
import { debounce } from '@/assets/game-helpers';
import { useDataStore } from '@/plugins/store/data';

export default defineComponent({
  props: {
    animeId: {
      required: true,
      type: String as PropType<AnimeIdType>
    },
    animeName: {
      required: true,
      type: String
    }
  },
  components: { TableFilterCombobox, TableFilterTextField },
  setup(_props, context) {
    const dataStore = useDataStore();
    const updateAnimeId = debounce((val: string) => {
      context.emit('update:anime-id', val || '');
    }, 100);
    const updateAnimeName = debounce((val: string) => {
      context.emit('update:anime-name', val || '');
    }, 100);

    return { updateAnimeId, updateAnimeName, dataStore };
  }
});
</script>
