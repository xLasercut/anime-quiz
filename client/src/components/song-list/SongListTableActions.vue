<template>
  <v-row dense justify="center">
    <v-col>
      <v-radio-group :disabled="disabled" v-model="internalModel" row dense hide-details>
        <v-radio label="Add Song" :value="SONG_LIST_EDIT_MODE.ADD"></v-radio>
        <v-radio label="Delete Song" :value="SONG_LIST_EDIT_MODE.REMOVE"></v-radio>
        <v-radio label="None" :value="SONG_LIST_EDIT_MODE.NONE"></v-radio>
      </v-radio-group>
    </v-col>
    <v-col cols="auto">
      <icon-btn
        v-if="internalModel !== SONG_LIST_EDIT_MODE.NONE && !disabled"
        icon="mdi-check"
        color="success"
        @click="$emit('confirm:edit')"
      >
        Confirm
      </icon-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api';
import IconBtn from '../shared/buttons/IconBtn.vue';
import { SONG_LIST_EDIT_MODE } from '../../assets/shared/constants';

export default defineComponent({
  components: { IconBtn },
  props: {
    value: {
      required: true
    },
    disabled: {
      required: true,
      type: Boolean
    }
  },
  setup(props, context) {
    const internalModel = ref(props.value);

    watch(
      () => internalModel.value,
      (val) => {
        context.emit('input', val);
      }
    );

    watch(
      () => props.value,
      (val) => {
        internalModel.value = val;
      }
    );

    return {
      internalModel,
      SONG_LIST_EDIT_MODE
    };
  }
});
</script>
