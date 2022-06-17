<template>
  <v-card-text>
    <v-form v-model="valid" @submit.prevent="submitEdit()">
      <v-container fluid>
        <dialog-text-field
          label="User ID"
          :value="$store.state.admin.userInEdit.user_id"
          disabled
        ></dialog-text-field>
        <dialog-text-field
          label="Username"
          :value="$store.state.admin.userInEdit.username"
          disabled
        ></dialog-text-field>
        <dialog-actions
          :disabled="editActionDisabled"
          @dialog:close="$emit('dialog:close')"
        ></dialog-actions>
      </v-container>
    </v-form>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import DialogActions from '../shared/dialog/DialogActions.vue';
import DialogTextField from '../shared/dialog/DialogTextField.vue';
import { store } from '../../plugins/store';
import { SHARED_EVENTS } from '../../assets/shared/events';
import { socket } from '../../plugins/socket';
import { newTableHelpers } from '../../assets/table-helper';

export default defineComponent({
  components: { DialogTextField, DialogActions },
  setup(_props, context) {
    const state = reactive({
      valid: false
    });

    const { editActionComplete, editActionDisabled } = newTableHelpers(context);

    function submitEdit(): void {
      if (state.valid) {
        editActionDisabled.value = true;
        socket.emit(
          SHARED_EVENTS.ADMIN_DELETE_USER,
          store.state.admin.userInEdit,
          (proceed: boolean) => {
            editActionComplete(proceed);
          }
        );
      }
    }

    return {
      ...toRefs(state),
      submitEdit,
      editActionDisabled
    };
  }
});
</script>
