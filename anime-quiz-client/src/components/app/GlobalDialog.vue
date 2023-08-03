<template>
  <v-dialog v-model="show" transition="fade-transition" width="800px">
    <v-card variant="flat">
      <v-card-title>
        <v-row justify="space-between">
          <v-col cols="auto">
            <span>{{ label }}</span>
          </v-col>
          <v-col cols="auto">
            <v-btn icon="mdi-close" variant="text" density="comfortable" size="small" @click="show = false"></v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <component :is="dialogComponent()" @dialog:close="show = false"></component>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { CLIENT_EVENTS } from '@/assets/events';
import { Component, defineComponent, reactive, toRefs } from 'vue';
import { DIALOG_MAPPINGS } from '@/assets/routing/mapping';
import { useClientStore } from '@/plugins/store/client';
import { RegisterOpenDialog } from '@/assets/types';
import { injectStrict } from '@/assets/game-helpers';

export default defineComponent({
  setup() {
    const clientStore = useClientStore();
    const state = reactive({
      label: '',
      show: false
    });

    function dialogComponent(): Component {
      return DIALOG_MAPPINGS[clientStore.dialogView];
    }

    function openDialog(dialog: string, label: string): void {
      clientStore.changeDialogView(dialog);
      state.label = label;
      state.show = true;
    }

    const registerOpenDialog = injectStrict<RegisterOpenDialog>(CLIENT_EVENTS.REGISTER_OPEN_DIALOG);
    registerOpenDialog(openDialog);

    return {
      ...toRefs(state),
      dialogComponent
    };
  }
});
</script>
