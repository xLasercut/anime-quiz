<template>
  <dialog-form v-model="valid" @submit.prevent="setSettings()">
    <dialog-text-field label="Server URL" v-model.trim="serverUrl" :rules="rules"></dialog-text-field>
    <dialog-actions @dialog:close="$emit('dialog:close')"></dialog-actions>
  </dialog-form>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import DialogActions from '@/components/common/dialogs/DialogActions.vue';
import DialogTextField from '@/components/common/dialogs/DialogTextField.vue';
import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';
import DialogForm from '@/components/common/dialogs/DialogForm.vue';

export default defineComponent({
  components: { DialogForm, DialogTextField, DialogActions },
  setup() {
    const state = reactive({
      valid: false,
      serverUrl: localStorage[LOCAL_STORAGE_CONSTANTS.GAME_SERVER] || '',
      rules: [(v: string): boolean | string => !!v || 'Game server required']
    });

    function setSettings() {
      if (state.valid) {
        localStorage[LOCAL_STORAGE_CONSTANTS.GAME_SERVER] = state.serverUrl;
        location.reload();
      }
    }

    return { ...toRefs(state), setSettings };
  }
});
</script>
