<template>
  <v-card-text>
    <v-form v-model="valid" @submit.prevent="submitEdit()">
      <v-container fluid>
        <dialog-text-field
          label="Anime ID"
          :value="$store.state.admin.animeInEdit.anime_id"
          disabled
        ></dialog-text-field>
        <dialog-multi-combobox
          label="Anime Names"
          :value="$store.state.admin.animeInEdit.anime_name"
          disabled
        ></dialog-multi-combobox>
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
import { socket } from '../../plugins/socket'
import { SHARED_EVENTS } from '../../assets/shared/events'
import { newTableHelpers } from '../../assets/table-helper'

export default defineComponent({
  components: { DialogMultiCombobox, DialogTextField, DialogActions },
  setup(_props, context) {
    const state = reactive({
      valid: false
    })

    const { editActionComplete, editActionDisabled } = newTableHelpers(context)

    function submitEdit(): void {
      if (state.valid) {
        editActionDisabled.value = true
        socket.emit(SHARED_EVENTS.ADMIN_DELETE_ANIME, store.state.admin.animeInEdit, (proceed: boolean) => {
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
