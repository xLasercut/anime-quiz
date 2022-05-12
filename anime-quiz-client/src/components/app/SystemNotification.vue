<template>
  <v-snackbar top :timeout="6000" :color="color" v-model="show">
    {{ message }}
    <template #action>
      <v-btn depressed icon @click="show = false" >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, toRefs } from '@vue/composition-api'
import { CLIENT_EVENTS } from '../../assets/events'

export default defineComponent({
  setup() {
    const state = reactive({
      message: '',
      show: false,
      color: 'error'
    })

    function _showNotification(color: string, message: string): void {
      state.color = color
      state.message = message
      state.show = true
    }

    function sendNotification(color: string, message: string): void {
      if (state.show) {
        state.show = false
        setTimeout((): void => {
          _showNotification(color, message)
        }, 100)
      } else {
        _showNotification(color, message)
      }
    }

    const registerSendNotification = inject<Function>(CLIENT_EVENTS.REGISTER_SEND_NOTIFICATION)
    if (registerSendNotification) {
      registerSendNotification(sendNotification)
    }

    return {
      ...toRefs(state)
    }
  }
})


</script>
