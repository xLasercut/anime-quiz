<template>
  <v-col cols="12">
    <v-row justify="center">
      <icon-btn color="success" icon="mdi-plus" @click="show = true">New Room</icon-btn>
    </v-row>
    <game-dialog label="New Room" v-model="show" @dialog:close="show = false">
      <v-form v-model="valid" @submit.prevent="newRoom()">
        <v-row justify="center">
          <dialog-text
            label="Room Name"
            v-model="roomName"
            :rules="nameRules"
            counter="20"
          ></dialog-text>
          <dialog-select
            label="Room Type"
            :items="roomTypes"
            v-model="roomType"
            :rules="typeRules"
          ></dialog-select>
          <dialog-confirm-btn :disabled="!valid"></dialog-confirm-btn>
        </v-row>
      </v-form>
    </game-dialog>
  </v-col>
</template>

<script lang="ts">
  import {defineComponent, reactive, toRefs} from '@vue/composition-api'
  import IconBtn from '@/components/buttons/IconBtn.vue'
  import DialogText from '@/components/dialog/DialogText.vue'
  import DialogSelect from '@/components/dialog/DialogSelect.vue'
  import GameDialog from '@/components/GameDialog.vue'
  import DialogConfirmBtn from '@/components/dialog/DialogConfirmBtn.vue'
  import {IRoomType} from '../../../../shared/types/game'
  import {NAME_FORMAT, ROOM_TYPE_FORMAT} from '@/assets/config/formats'
  import {socket} from '@/assets/socket'

  interface IState {
    show: boolean
    roomTypes: Array<IRoomType>
    roomType: IRoomType
    roomName: string
    valid: boolean
    nameRules: Array<any>
    typeRules: Array<any>
  }

  export default defineComponent({
    components: {
      IconBtn, DialogText, DialogSelect, GameDialog, DialogConfirmBtn
    },
    setup(_props, context) {
      const state = reactive<IState>({
        show: false,
        roomTypes: ['amq'],
        roomType: 'amq',
        roomName: '',
        valid: false,
        nameRules: [
          (v: string): boolean | string => (!!v) || 'Room name required',
          (v: string): boolean | string => NAME_FORMAT.test(v) || 'Room name can only contain: 0-9, A-Z, a-z and space',
          (v: string): boolean | string => (v && v.length <= 20) || 'Room name must be under 20 characters'
        ],
        typeRules: [
          (v: string): boolean | string => ROOM_TYPE_FORMAT.test(v) || 'Invalid room type'
        ]
      })

      function newRoom(): void {
        let event = `LOGIN_${state.roomType.toUpperCase()}_NEW`
        socket.emit(event, state.roomName)
        context.root.$store.commit('UPDATE_ROOM_MODE', state.roomType)
      }

      return {...toRefs(state), newRoom}
    }
  })
</script>
