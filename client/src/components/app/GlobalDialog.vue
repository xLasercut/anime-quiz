<template>
  <v-dialog v-model="show" transition="fade-transition" width="800px">
    <v-card flat>
      <v-card-title>
        <v-row justify="space-between">
          <v-col cols="auto">
            <span>{{ label }}</span>
          </v-col>
          <v-col cols="auto">
            <v-btn depressed icon @click="show = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <component :is="dialogComponent()" @dialog:close="show = false"></component>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, toRefs } from '@vue/composition-api';
import { MUTATIONS } from '../../plugins/store/mutations';
import { store } from '../../plugins/store';
import { CLIENT_EVENTS } from '../../assets/events';
import { dialogComponent } from '../../plugins/routing/mapping';

export default defineComponent({
  setup() {
    const state = reactive({
      label: '',
      show: false
    });

    function openDialog(dialog: string, label: string): void {
      store.commit(MUTATIONS.CHANGE_DIALOG_VIEW, dialog);
      state.label = label;
      state.show = true;
    }

    const registerOpenDialog = inject<Function>(CLIENT_EVENTS.REGISTER_OPEN_DIALOG);
    if (registerOpenDialog) {
      registerOpenDialog(openDialog);
    }

    return {
      ...toRefs(state),
      dialogComponent
    };
  }
});
</script>
