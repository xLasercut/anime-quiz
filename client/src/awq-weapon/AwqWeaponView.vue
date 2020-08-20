<template>
  <v-main>
    <v-card flat>
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="auto">
            <icon-btn icon="mdi-plus" color="success" @click="openDialog(null)">Add Weapon</icon-btn>
          </v-col>
        </v-row>
        <awq-weapon-list-table
          @weapon:edit="openDialog($event)"
          @weapon:delete="deleteGameWeapon($event)"
        ></awq-weapon-list-table>
        <game-dialog
          label="Weapon Editor"
          v-model="show"
        >
          <v-form v-model="valid" @submit.prevent="confirmWeaponEdit()">
            <v-row justify="center" dense>
              <v-col cols="auto">
                <v-img :src="form.src" width="100px"></v-img>
              </v-col>
              <dialog-multi-select
                label="Anime"
                v-model="form.anime"
                :items="$store.state.awq.choices.anime"
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
import AwqWeaponListTable from '@/awq-weapon/AwqWeaponListTable.vue'
import IconBtn from '@/components/buttons/IconBtn.vue'
import GameDialog from '@/components/GameDialog.vue'
import {IAwqWeapon} from '../../../shared/interfaces/database'
import DialogText from '@/components/dialog/DialogText.vue'
import DialogConfirmBtn from '@/components/dialog/DialogConfirmBtn.vue'
import DialogMultiSelect from '@/components/dialog/DialogMultiSelect.vue'
import {socket} from '@/assets/socket'

export default defineComponent({
  components: {
    AwqWeaponListTable, IconBtn, GameDialog, DialogText, DialogConfirmBtn, DialogMultiSelect
  },
  setup(_props, context) {
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

    function getDefaultForm(): IAwqWeapon {
      return {
        anime: [],
        name: '',
        src: '',
        weaponId: ''
      }
    }

    function openDialog(weapon: IAwqWeapon | null): void {
      if (weapon) {
        state.form = Object.assign({}, weapon)
        state.isEdit = true
      }
      else {
        state.form = Object.assign({}, getDefaultForm())
        state.isEdit = false
      }
      state.show = true
    }

    function confirmWeaponEdit(): void {
      if (state.valid && state.show) {
        if (state.isEdit) {
          socket.emit('EDIT_AWQ_GAME_WEAPON', state.form)
        }
        else {
          socket.emit('ADD_AWQ_GAME_WEAPON', state.form)
        }
        state.show = false
      }
    }

    function deleteGameWeapon(weapon: IAwqWeapon): void {
      socket.emit('DELETE_AWQ_GAME_WEAPON', weapon)
    }

    return {...toRefs(state), openDialog, confirmWeaponEdit, deleteGameWeapon}
  }
})
</script>
