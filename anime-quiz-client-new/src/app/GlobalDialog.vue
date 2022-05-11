<template>
  <v-dialog
    v-model="state.show"
    transition="fade-transition"
  >
    <v-container>
      <v-row>
        <v-card width="800px" flat>
          <template #title>
            <v-row justify="space-between">
              <v-col cols="auto">
                <span>{{ state.label }}</span>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  icon="mdi-close"
                  flat
                  text
                  size="x-small"
                  @click="state.show = false"
                ></v-btn>
              </v-col>
            </v-row>
          </template>
          <component :is="dialogComponent()" @dialog:close="state.show = false"></component>
        </v-card>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<script setup lang="ts">
import {inject, reactive} from 'vue'
import {CLIENT_EVENTS} from '../assets/events'
import {dialogComponent} from '../plugins/routing/mapping'
import {useStore} from 'vuex'
import {MUTATIONS} from '../plugins/store/mutations'

const store = useStore()

const state = reactive({
  label: '',
  show: false
})

function openDialog(dialog: string, label: string): void {
  store.commit(MUTATIONS.CHANGE_DIALOG_VIEW, dialog)
  state.label = label
  state.show = true
}

const registerOpenDialog = inject<Function>(CLIENT_EVENTS.REGISTER_OPEN_DIALOG)
if (registerOpenDialog) {
  registerOpenDialog(openDialog)
}
</script>
