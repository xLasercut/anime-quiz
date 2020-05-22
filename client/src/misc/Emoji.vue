<template>
  <v-card flat>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="auto">
          <icon-btn icon="mdi-plus" color="success" @click="show = true">New Emoji</icon-btn>
        </v-col>
      </v-row>
      <emoji-list-table></emoji-list-table>
      <game-dialog v-model="show" label="Emoji Editor"
      >
        <v-form v-model="valid">
          <v-row justify="center">
            <dialog-text
              label="Command"
              v-model.trim="form.command"
            ></dialog-text>
            <dialog-text
              label="Source"
              v-model.trim="form.src"
            ></dialog-text>
          </v-row>
        </v-form>
      </game-dialog>
    </v-container>
  </v-card>
</template>

<script lang="ts">
  import {defineComponent, reactive, toRefs} from '@vue/composition-api'
  import EmojiListTable from '@/misc/emoji/EmojiListTable.vue'
  import GameDialog from '@/components/GameDialog.vue'
  import IconBtn from '@/components/buttons/IconBtn.vue'
  import DialogText from '@/components/dialog/DialogText.vue'

  export default defineComponent({
    components: {
      EmojiListTable, GameDialog, IconBtn, DialogText
    },
    setup(_props, context) {
      const state = reactive({
        show: false,
        valid: false,
        form: {
          command: '',
          src: ''
        }
      })

      return {...toRefs(state)}
    }
  })
</script>
