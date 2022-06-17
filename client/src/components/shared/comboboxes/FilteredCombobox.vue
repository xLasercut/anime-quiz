<template>
  <v-combobox
    v-bind="$attrs"
    :value="value"
    @input="$emit('input', $event)"
    @keyup.enter.native="$emit('key:enter')"
    @change="$emit('change')"
    :filter="onFilter"
  ></v-combobox>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { shouldDisplayResult } from '../../../assets/game-helper';

export default defineComponent({
  props: {
    value: {
      required: true
    }
  },
  setup() {
    function onFilter(item: string, queryText: string, itemText: string) {
      return shouldDisplayResult(queryText, itemText);
    }

    return {
      onFilter
    };
  }
});
</script>
