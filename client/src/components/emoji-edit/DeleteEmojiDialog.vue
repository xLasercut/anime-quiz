<template>
  <v-card-text>
    <v-form v-model="valid" @submit.prevent="submitEdit()">
      <v-container fluid>
        <dialog-text-field
          label="Emoji ID"
          :value="$store.state.admin.emojiInEdit.emoji_id"
          disabled
        ></dialog-text-field>
        <dialog-text-field
          label="Command"
          :value="$store.state.admin.emojiInEdit.command"
          disabled
        ></dialog-text-field>
        <dialog-text-field
          label="Source"
          :value="$store.state.admin.emojiInEdit.src"
          disabled
        ></dialog-text-field>
        <dialog-select
          label="Type"
          :items="emojiTypes"
          :value="$store.state.admin.emojiInEdit.type"
          disabled
        ></dialog-select>
        <dialog-actions :disabled="editActionDisabled" @dialog:close="$emit('dialog:close')"></dialog-actions>
      </v-container>
    </v-form>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import DialogActions from '../shared/dialog/DialogActions.vue'
import DialogMultiCombobox from '../shared/dialog/DialogMultiCombobox.vue'
import DialogTextField from '../shared/dialog/DialogTextField.vue'
import { store } from '../../plugins/store'
import { MUTATIONS } from '../../plugins/store/mutations'
import DialogSelect from '../shared/dialog/DialogSelect.vue'
import { EMOJI_TYPES } from '../../assets/constants'
import DialogMultiAutocomplete from '../shared/dialog/DialogMultiAutocomplete.vue'
import { DIALOG_ROUTES } from '../../plugins/routing/routes'
import { SHARED_EVENTS } from '../../assets/shared/events'
import { socket } from '../../plugins/socket'
import { VALID_EMOJI_TYPES } from '../../assets/shared/constants'
import { newTableHelpers } from '../../assets/table-helper'

export default defineComponent({
  components: { DialogMultiAutocomplete, DialogSelect, DialogMultiCombobox, DialogTextField, DialogActions },
  setup(_props, context) {
    const state = reactive({
      valid: false,
      emojiTypes: EMOJI_TYPES
    })

    const { editActionComplete, editActionDisabled } = newTableHelpers(context)

    function submitEdit(): void {
      if (state.valid) {
        editActionDisabled.value = true
        socket.emit(SHARED_EVENTS.ADMIN_DELETE_EMOJI, store.state.admin.emojiInEdit, (proceed: boolean) => {
          editActionComplete(proceed)
        })
      }
    }

    return {
      ...toRefs(state),
      submitEdit,
      editActionDisabled
    }
  }
})
</script>
