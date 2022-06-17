<template>
  <v-card-text>
    <v-form v-model="valid" @submit.prevent="setSettings()">
      <v-container fluid>
        <dialog-text-field
          label="Server URL"
          v-model.trim="serverUrl"
          :rules="rules"
        ></dialog-text-field>
        <dialog-actions @dialog:close="$emit('dialog:close')"></dialog-actions>
      </v-container>
    </v-form>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import DialogTextField from '../shared/dialog/DialogTextField.vue';
import DialogActions from '../shared/dialog/DialogActions.vue';
import { LOCAL_STORAGE_CONSTANTS } from '../../assets/constants';

export default defineComponent({
  components: { DialogTextField, DialogActions },
  setup() {
    const state = reactive({
      serverUrl: localStorage[LOCAL_STORAGE_CONSTANTS.GAME_SERVER] || '',
      valid: false,
      rules: [(v: string): boolean | string => !!v || 'Game server required']
    });

    function setSettings(): void {
      if (state.valid) {
        localStorage.GAME_SERVER = state.serverUrl;
        location.reload();
      }
    }

    return {
      ...toRefs(state),
      setSettings
    };
  }
});
</script>
