<template>
  <v-form v-model="valid" @submit.prevent="confirmSettingChange()">
    <v-row justify="center" dense>
      <dialog-slider
        label="Image Count" min="1" max="100"
        :value="$store.state.aiq.settings.imageCount"
        @input="updateAiqSettings('weaponCount', $event)"
        hide-details
        :disabled="disabled()"
      ></dialog-slider>
      <dialog-slider
        label="Guess Time" min="1" max="50"
        :value="$store.state.aiq.settings.guessTime"
        @input="updateAiqSettings('guessTime', $event)"
        hide-details
        :disabled="disabled()"
      ></dialog-slider>
      <dialog-slider
        label="Min Blur Factor" min="5" max="200"
        :value="$store.state.aiq.settings.minFactor"
        @input="updateAiqSettings('minFactor', $event)"
        :disabled="disabled()"
      ></dialog-slider>
      <dialog-slider
        label="Max Blur Factor" min="5" max="200"
        :value="$store.state.aiq.settings.maxFactor"
        @input="updateAiqSettings('maxFactor', $event)"
        :disabled="disabled()"
      ></dialog-slider>
      <dialog-radio
        label="Duplicate"
        :items="duplicateItems"
        :value="$store.state.aiq.settings.duplicate"
        @input="updateAiqSettings('duplicate', $event)"
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
      ],
      minFactorRules: [

      ],
      maxFactorRules: [

      ]
    })

    function updateAiqSettings(key: string, value: Array<string> | number | boolean): void {
      const aiqSettings = context.root.$store.state.aiq.settings
      aiqSettings[key] = value
      context.root.$store.commit('SOCKET_UPDATE_AIQ_SETTINGS', aiqSettings)
    }

    function confirmSettingChange(): void {
      socket.emit('UPDATE_AIQ_SETTINGS', context.root.$store.state.aiq.settings)
      context.emit('dialog:close')
    }

    function disabled(): boolean {
      return !(context.root.$store.state.aiq.host || context.root.$store.state.client.admin) || context.root.$store.state.aiq.gameState.playing
    }

    return {...toRefs(state), updateAiqSettings, confirmSettingChange, disabled}
  }
})
</script>
