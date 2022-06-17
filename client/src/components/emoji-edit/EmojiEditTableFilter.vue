<template>
  <v-row dense>
    <v-col>
      <v-text-field
        dense
        outlined
        :value="emojiCommandFilter"
        @input="updateFilter('emoji-command-filter', $event)"
        label="Command"
        hide-details
        clearable
      ></v-text-field>
    </v-col>
    <v-col>
      <v-text-field
        dense
        outlined
        :value="emojiSourceFilter"
        @input="updateFilter('emoji-source-filter', $event)"
        label="Source"
        hide-details
        clearable
      ></v-text-field>
    </v-col>
    <v-col>
      <v-select
        :value="emojiTypeFilter"
        @input="updateFilter('emoji-type-filter', $event)"
        :items="emojiTypes"
        dense
        outlined
        label="Type"
        hide-details
      ></v-select>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { newTableHelpers } from '../../assets/table-helper';
import { EMOJI_TYPES } from '../../assets/constants';

export default defineComponent({
  props: {
    emojiCommandFilter: {
      required: true
    },
    emojiSourceFilter: {
      required: true
    },
    emojiTypeFilter: {
      required: true
    }
  },
  setup(_props, context) {
    const state = reactive({
      emojiTypes: [{ text: 'ALL', value: '' }].concat(EMOJI_TYPES)
    });

    const { updateFilter } = newTableHelpers(context);

    return {
      ...toRefs(state),
      updateFilter
    };
  }
});
</script>
