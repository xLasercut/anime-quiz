<template>
  <v-main>
    <v-card flat>
      <v-card-title>
        <v-row justify="center">
          <v-col cols="auto">
            <h2>Login</h2>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text>
        <v-form v-model="valid" @submit.prevent="login()">
          <login-input
            label="Display Name"
            v-model.trim="username"
            :rules="usernameRules"
            counter="20"
          ></login-input>
          <login-input
            label="Server Password"
            v-model.trim="password"
            :rules="passwordRules"
          ></login-input>
          <v-row justify="center">
            <v-col cols="auto">
              <icon-btn color="success" type="submit" large icon="mdi-login">Login</icon-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import {SHARED_EVENTS} from '../assets/shared/events'
import LoginInput from '../components/login/LoginInput.vue'
import {socket} from '../plugins/socket'
import {MUTATIONS} from '../plugins/store/mutations'
import {ROUTES} from '../plugins/routing/routes'
import {LOCAL_STORAGE_CONSTANTS} from '../assets/constants'
import {defineComponent, inject, reactive, toRefs} from '@vue/composition-api'
import {store} from '../plugins/store'
import IconBtn from '../components/shared/buttons/IconBtn.vue'


const NAME_FORMAT = new RegExp('^[A-Za-z0-9 ]+$')
const SERVER_PASSWORD_FORMAT = new RegExp('^[A-Za-z0-9]+$')

export default defineComponent({
  components: {IconBtn, LoginInput},
  setup() {
    const state = reactive({
      valid: false,
      username: localStorage[LOCAL_STORAGE_CONSTANTS.AQ_USERNAME] || '',
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
        localStorage.AQ_USERNAME = state.username
        socket.connect()
        socket.emit(SHARED_EVENTS.AUTHENTICATE, state.username, state.password, (auth: boolean): void => {
          if (auth) {
            store.commit(MUTATIONS.CHANGE_VIEW, ROUTES.LOBBY)
          }
        })
      }
    }

    return {
      ...toRefs(state),
      login
    }
  }
})
</script>
