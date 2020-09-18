<template>
  <v-main>
    <v-card flat>
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="auto">
            <icon-btn icon="mdi-plus" color="success" @click="openDialog(null)">Add Image</icon-btn>
          </v-col>
        </v-row>
        <aiq-image-list-table
          @image:edit="openDialog($event)"
          @image:delete="deleteGameImage($event)"
        ></aiq-image-list-table>
        <game-dialog
          label="Image Editor"
          v-model="show"
        >
          <v-form v-model="valid" @submit.prevent="confirmImageEdit()">
            <v-row justify="center" dense>
              <v-col cols="auto">
                <v-img :src="form.src" width="100px"></v-img>
              </v-col>
              <dialog-multi-select
                label="Anime"
                v-model="form.anime"
                :items="$store.state.aiq.choices.anime"
                :rules="animeRules"
              ></dialog-multi-select>
              <dialog-text
                label="Name"
                v-model.trim="form.name"
                :rules="nameRules"
              ></dialog-text>
              <dialog-text
                label="Source"
                v-model.trim="form.src"
                :rules="srcRules"
              ></dialog-text>
              <dialog-confirm-btn :disabled="!valid"></dialog-confirm-btn>
            </v-row>
          </v-form>
        </game-dialog>
      </v-container>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from '@vue/composition-api'
import IconBtn from '@/components/buttons/IconBtn.vue'
import GameDialog from '@/components/GameDialog.vue'
import {IAiqImage} from '../../../shared/interfaces/database'
import DialogText from '@/components/dialog/DialogText.vue'
import DialogConfirmBtn from '@/components/dialog/DialogConfirmBtn.vue'
import DialogMultiSelect from '@/components/dialog/DialogMultiSelect.vue'
import {socket} from '@/assets/socket'
import AiqImageListTable from '@/aiq-image/AiqImageListTable.vue'

export default defineComponent({
  components: {
    AiqImageListTable, IconBtn, GameDialog, DialogText, DialogConfirmBtn, DialogMultiSelect
  },
  setup(_props, _context) {
    const state = reactive({
      show: false,
      valid: false,
      isEdit: false,
      form: Object.assign({}, getDefaultForm()),
      srcRules: [
        (v: string): boolean | string => (!!v) || 'Source cannot be empty'
      ],
      nameRules: [
        (v: string): boolean | string => (!!v) || 'Name cannot be empty'
      ],
      animeRules: [
        (v: Array<string>): boolean | string => v.length > 0 || 'Anime cannot be empty'
      ],
      showOverlay: false
    })

    function getDefaultForm(): IAiqImage {
      return {
        anime: [],
        name: '',
        src: '',
        imageId: ''
      }
    }

    function openDialog(image: IAiqImage | null): void {
      if (image) {
        state.form = Object.assign({}, image)
        state.isEdit = true
      }
      else {
        state.form = Object.assign({}, getDefaultForm())
        state.isEdit = false
      }
      state.show = true
    }

    function confirmImageEdit(): void {
      if (state.valid && state.show) {
        if (state.isEdit) {
          socket.emit('EDIT_AIQ_GAME_IMAGE', state.form)
        }
        else {
          socket.emit('ADD_AIQ_GAME_IMAGE', state.form)
        }
        state.show = false
      }
    }

    function deleteGameImage(image: IAiqImage): void {
      socket.emit('DELETE_AIQ_GAME_IMAGE', image)
    }

    return {...toRefs(state), openDialog, confirmImageEdit, deleteGameImage}
  }
})
</script>
