<template>
  <v-combobox
    :custom-filter="customFilter"
    v-model="searchValue"
    @keydown.enter="updateModel()"
    @click:clear="updateModel()"
    @blur="updateModel()"
  ></v-combobox>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue';
import { isMatchFilter } from '@/assets/game-helpers';

export default defineComponent({
  props: {
    modelValue: {
      required: true,
      type: String
    }
  },
  setup(props, context) {
    const state = reactive({
      searchValue: props.modelValue
    });
    function customFilter(value: string, query: string) {
      return isMatchFilter(query, value);
    }

    function updateModel() {
      context.emit('update:model-value', state.searchValue || '');
    }

    watch(
      () => props.modelValue,
      (val) => {
        state.searchValue = val;
      }
    );

    return { customFilter, updateModel, ...toRefs(state) };
  }
});
</script>
