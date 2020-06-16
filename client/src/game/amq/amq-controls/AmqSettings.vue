<template>
  <v-form v-model="valid" @submit.prevent="confirmSettingChange()">
    <v-row justify="center">
      <dialog-slider
        label="Song Count" min="1" max="100"
        :value="$store.state.amq.settings.songCount"
        @input="updateAmqSettings('songCount', $event)"
      ></dialog-slider>
      <dialog-slider
        label="Guess Time" min="1" max="50"
        :value="$store.state.amq.settings.guessTime"
        @input="updateAmqSettings('guessTime', $event)"
      ></dialog-slider>
      <dialog-slider
        label="Song Select Time" min="10" max="30"
        :value="$store.state.amq.settings.selectTime"
        @input="updateAmqSettings('selectTime', $event)"
      ></dialog-slider>
      <dialog-confirm-btn></dialog-confirm-btn>
    </v-row>
  </v-form>
</template>

<script lang="ts">
  import {defineComponent, reactive, toRefs} from '@vue/composition-api'
  import DialogConfirmBtn from '@/components/dialog/DialogConfirmBtn.vue'
  import DialogSlider from '@/components/dialog/DialogSlider.vue'
  import {socket} from '@/assets/socket'

  export default defineComponent({
    components: {
      DialogConfirmBtn, DialogSlider
    },
    setup(_props, context) {
      const state = reactive({
        valid: false
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

      return {...toRefs(state), updateAmqSettings, confirmSettingChange}
    }
  })
</script>
