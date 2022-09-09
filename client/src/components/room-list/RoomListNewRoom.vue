<template>
  <v-card-text>
    <v-form v-model="valid" @submit.prevent="newRoom()">
      <v-container fluid>
        <dialog-text-field
          :disabled="disabled"
          counter="20"
          label="Room Name"
          v-model.trim="roomName"
          :rules="rules"
        ></dialog-text-field>
        <dialog-actions :disabled="disabled" @dialog:close="$emit('dialog:close')"></dialog-actions>
      </v-container>
    </v-form>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import DialogTextField from '../shared/dialog/DialogTextField.vue';
import DialogActions from '../shared/dialog/DialogActions.vue';
import { socket } from '../../plugins/socket';
import { SHARED_EVENTS } from '../../assets/shared/events';
import { store } from '../../plugins/store';
import { ROUTES } from '../../plugins/routing/routes';
import { MUTATIONS } from '../../plugins/store/mutations';
import { ROOM_NAME_FORMAT } from '../../assets/shared/constants/formats';

export default defineComponent({
  components: { DialogTextField, DialogActions },
  setup(_props, context) {
    const state = reactive({
      roomName: '',
      rules: [
        (v: string): boolean | string => !!v || 'Room name required',
        (v: string): boolean | string =>
          ROOM_NAME_FORMAT.test(v) || 'Room name can only contain: 0-9, A-Z, a-z and space',
        (v: string): boolean | string =>
          (v && v.length <= 20) || 'Room name must be under 20 characters'
      ],
      valid: false,
      disabled: false
    });

    function newRoom(): void {
      if (state.valid) {
        state.disabled = true;
        socket.emit(SHARED_EVENTS.NEW_GAME_ROOM, state.roomName, (proceed: boolean) => {
          if (proceed) {
            state.roomName = '';
            context.emit('dialog:close');
            store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.GAME_ROOM);
          }
          state.disabled = false;
        });
      }
    }

    return {
      ...toRefs(state),
      newRoom
    };
  }
});
</script>
