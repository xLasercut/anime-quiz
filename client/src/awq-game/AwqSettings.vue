<template>
  <v-form v-model="valid" @submit.prevent="confirmSettingChange()">
    <v-row justify="center" dense>
      <dialog-slider
        label="Weapon Count" min="1" max="100"
        :value="$store.state.awq.settings.weaponCount"
        @input="updateAwqSettings('weaponCount', $event)"
        hide-details
        :disabled="disabled()"
      ></dialog-slider>
      <dialog-slider
        label="Guess Time" min="1" max="50"
        :value="$store.state.awq.settings.guessTime"
        @input="updateAwqSettings('guessTime', $event)"
        hide-details
        :disabled="disabled()"
      ></dialog-slider>
      <dialog-radio
        label="Duplicate"
        :items="duplicateItems"
        :value="$store.state.amq.settings.duplicate"
        @input="updateAwqSettings('duplicate', $event)"
        row hide-details
        :disabled="disabled()"
      ></dialog-radio>
      <dialog-confirm-btn :disabled="!valid || disabled()"></dialog-confirm-btn>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from '@vue/composition-api'
import DialogConfirmBtn from '@/components/dialog/DialogConfirmBtn.vue'
import DialogSlider from '@/components/dialog/DialogSlider.vue'
import {socket} from '@/assets/socket'
import DialogRadio from '@/components/dialog/DialogRadio.vue'

export default defineComponent({
  components: {
    DialogConfirmBtn, DialogSlider, DialogRadio
  },
  setup(_props, context) {
    const state = reactive({
      valid: false,
      duplicateItems: [
        {label: 'Yes', value: true},
        {label: 'No', value: false}
      ]
    })

    function updateAwqSettings(key: string, value: Array<string> | number | boolean): void {
      const awqSettings = context.root.$store.state.awq.settings
      awqSettings[key] = value
      context.root.$store.commit('SOCKET_UPDATE_AWQ_SETTINGS', awqSettings)
    }

    function confirmSettingChange(): void {
      socket.emit('UPDATE_AWQ_SETTINGS', context.root.$store.state.awq.settings)
      context.emit('dialog:close')
    }

    function disabled(): boolean {
      return !(context.root.$store.state.awq.host || context.root.$store.state.client.admin) || context.root.$store.state.awq.gameState.playing
    }

    return {...toRefs(state), updateAwqSettings, confirmSettingChange, disabled}
  }
})
</script>
