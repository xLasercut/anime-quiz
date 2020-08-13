<template>
  <v-form v-model="valid" @submit.prevent="confirmSettingChange()">
    <v-row justify="center">
      <dialog-slider
        label="Song Count" min="1" max="100"
        :value="$store.state.amq.settings.songCount"
        @input="updateAmqSettings('songCount', $event)"
        hide-details
        :disabled="disabled()"
      ></dialog-slider>
      <dialog-slider
        label="Guess Time" min="1" max="50"
        :value="$store.state.amq.settings.guessTime"
        @input="updateAmqSettings('guessTime', $event)"
        hide-details
        :disabled="disabled()"
      ></dialog-slider>
      <dialog-radio
        label="Duplicate"
        :items="duplicateItems"
        :value="$store.state.amq.settings.duplicate"
        @input="updateAmqSettings('duplicate', $event)"
        row hide-details
        :disabled="disabled()"
      ></dialog-radio>
      <dialog-radio
        label="Last Played"
        :items="duplicateItems"
        :value="$store.state.amq.settings.leastPlayed"
        @input="updateAmqSettings('leastPlayed', $event)"
        row hide-details
        :disabled="disabled()"
      ></dialog-radio>
      <dialog-radio
        label="Game Mode"
        :items="gameModes"
        :value="$store.state.amq.settings.gameMode"
        @input="updateAmqSettings('gameMode', $event)"
        row hide-details
        :disabled="disabled()"
      ></dialog-radio>
      <dialog-checkbox
        :value="$store.state.amq.settings.users"
        @input="updateAmqSettings('users', $event)"
        :items="users"
        :disabled="disabled()"
      ></dialog-checkbox>
      <dialog-confirm-btn :disabled="!valid || disabled()"></dialog-confirm-btn>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, toRefs} from '@vue/composition-api'
import DialogConfirmBtn from '@/components/dialog/DialogConfirmBtn.vue'
import DialogSlider from '@/components/dialog/DialogSlider.vue'
import {socket} from '@/assets/socket'
import DialogRadio from '@/components/dialog/DialogRadio.vue'
import DialogCheckbox from '@/components/dialog/DialogCheckbox.vue'

export default defineComponent({
  components: {
    DialogConfirmBtn, DialogSlider, DialogRadio, DialogCheckbox
  },
  setup(_props, context) {
    const state = reactive({
      valid: false,
      duplicateItems: [
        {label: 'Yes', value: true},
        {label: 'No', value: false}
      ],
      gameModes: [
        {label: 'Normal', value: 'normal'},
        {label: 'Balanced', value: 'balanced'}
      ]
    })

    function updateAmqSettings(key: string, value: Array<string> | number | boolean): void {
      const amqSettings = context.root.$store.state.amq.settings
      amqSettings[key] = value
      context.root.$store.commit('SOCKET_UPDATE_AMQ_SETTINGS', amqSettings)
    }

    function confirmSettingChange(): void {
      socket.emit('UPDATE_AMQ_SETTINGS', context.root.$store.state.amq.settings)
      context.emit('dialog:close')
    }

    const users = computed(() => {
      return context.root.$store.state.amq.users.map((user: string) => {
        return {label: user, value: user}
      })
    })

    function disabled(): boolean {
      return !(context.root.$store.state.amq.host || context.root.$store.state.client.admin) || context.root.$store.state.amq.gameState.playing
    }

    return {...toRefs(state), updateAmqSettings, confirmSettingChange, users, disabled}
  }
})
</script>
