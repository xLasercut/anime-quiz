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
          @input="updateUsername($event)"
          :rules="usernameRules"
          :disabled="editActionDisabled"
        ></dialog-text-field>
        <dialog-actions :disabled="editActionDisabled" @dialog:close="$emit('dialog:close')"></dialog-actions>
      </v-container>
    </v-form>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import DialogActions from '../shared/dialog/DialogActions.vue'
import DialogTextField from '../shared/dialog/DialogTextField.vue'
import { store } from '../../plugins/store'
import { MUTATIONS } from '../../plugins/store/mutations'
import { DIALOG_ROUTES } from '../../plugins/routing/routes'
import { SHARED_EVENTS } from '../../assets/shared/events'
import { socket } from '../../plugins/socket'
import { newTableHelpers } from '../../assets/table-helper'
import { USERNAME_FORMAT } from '../../assets/shared/constants'

export default defineComponent({
  components: { DialogTextField, DialogActions },
  setup(_props, context) {
    const state = reactive({
      valid: false,
      usernameRules: [
        (v: string) => !!v || 'Username required',
        (v: string) => validateDupeUsername(v) || 'Username already exists',
        (v: string) => USERNAME_FORMAT.test(v) || 'Username can only contain: 0-9, A-Z, a-z and space'
      ]
    })

    function validateDupeUsername(username: string): boolean {
      for (const user of store.getters.userLists) {
        if (!username || username.toLowerCase().trim() === user.username.toLowerCase()) {
          return false
        }
      }
      return true
    }


    function updateUsername(command: string): void {
      store.commit(MUTATIONS.ADMIN_UPDATE_USER_NAME, command)
    }

    const { editActionComplete, editActionDisabled } = newTableHelpers(context)

    function submitEdit(): void {
      if (state.valid) {
        editActionDisabled.value = true
        if (store.state.client.dialogView === DIALOG_ROUTES.NEW_USER_DIALOG) {
          socket.emit(SHARED_EVENTS.ADMIN_NEW_USER, store.state.admin.userInEdit, (proceed: boolean) => {
            editActionComplete(proceed)
          })
        }
        else if (store.state.client.dialogView === DIALOG_ROUTES.EDIT_USER_DIALOG) {
          socket.emit(SHARED_EVENTS.ADMIN_EDIT_USER, store.state.admin.userInEdit, (proceed: boolean) => {
            editActionComplete(proceed)
          })
        }
      }
    }

    return {
      ...toRefs(state),
      submitEdit,
      updateUsername,
      editActionDisabled
    }
  }
})
</script>
