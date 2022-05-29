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
        <dialog-actions :disabled="disabled" @dialog:close="$emit('dialog:close')"></dialog-actions>
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

export default defineComponent({
  components: { DialogMultiCombobox, DialogTextField, DialogActions },
  setup(_props, context) {
    const state = reactive({
      valid: false,
      disabled: false
    })

    function submitEdit(): void {
      if (state.valid) {
        state.disabled = true
        socket.emit(SHARED_EVENTS.ADMIN_DELETE_ANIME, store.state.admin.animeInEdit, (proceed: boolean) => {
          if (proceed) {
            state.disabled = false
            context.emit('dialog:close')
          }
        })
      }
    }

    return {
      ...toRefs(state),
      submitEdit
    }
  }
})
</script>
