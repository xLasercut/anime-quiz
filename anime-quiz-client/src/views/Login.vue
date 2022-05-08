<template>
  <v-main>
    <v-row justify="center">
      <v-col cols="auto">
        <h2>Login</h2>
      </v-col>
    </v-row>
    <v-form v-model="state.valid" @submit="login()">
      <login-input
        label="Display Name"
        v-model="state.username"
        :rules="state.usernameRules"
        counter="20"
      ></login-input>
      <login-input
        label="Server Password"
        v-model="state.password"
        :rules="state.passwordRules"
      ></login-input>
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn
            type="submit"
            :flat="true"
            size="large"
            color="success"
            append-icon="mdi-login"
            :disabled="state.disabled"
          >Login</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-main>
</template>

<script setup lang="ts">
import {inject, reactive} from 'vue'
import {SHARED_EVENTS} from '../assets/shared/events'
import LoginInput from '../login/LoginInput.vue'
import {socket} from '../plugins/socket'
import {useStore} from 'vuex'
import {MUTATIONS} from '../plugins/store/mutations'
import {ROUTES} from '../plugins/routing/routes'

const store = useStore()

const NAME_FORMAT = new RegExp('^[A-Za-z0-9 ]+$')
const SERVER_PASSWORD_FORMAT = new RegExp('^[A-Za-z0-9]+$')

const state = reactive({
  valid: false,
  username: '',
  password: '',
  usernameRules: [
    (v: string): boolean | string => (!!v) || 'Display name required',
    (v: string): boolean | string => NAME_FORMAT.test(v) || 'Display name can only contain: 0-9, A-Z, a-z and space',
    (v: string): boolean | string => (v && v.length <= 20) || 'Display name must be under 20 characters'
  ],
  passwordRules: [
    (v: string): boolean | string => (!!v) || 'Server password required',
    (v: string): boolean | string => SERVER_PASSWORD_FORMAT.test(v) || 'Valid characters A-Z, a-z, 0-9'
  ],
  disabled: false
})

const systemNotification = inject<Function>(SHARED_EVENTS.SYSTEM_NOTIFICATION)

function login() {
  if (state.valid) {
    socket.connect()
    socket.emit(SHARED_EVENTS.AUTHENTICATE, state.username, state.password, (auth: boolean): void => {
      if (auth) {
        store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.LOBBY)
      }
    })
  }
}
</script>
