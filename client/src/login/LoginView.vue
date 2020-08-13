<template>
  <v-main>
    <v-form v-model="valid" @submit.prevent="login()">
      <v-row justify="center">
        <v-col cols="auto">
          <h2>Login</h2>
        </v-col>
      </v-row>
      <login-input-text
        label="Display Name"
        :value="$store.state.client.username"
        @input="$store.commit('UPDATE_USERNAME', $event)"
        :rules="usernameRules"
        counter="20"
        :disabled="disabled"
      ></login-input-text>
      <login-input-text
        label="Server Password"
        v-model.trim="password"
        :type="inputType"
        :append-icon="passIcon"
        @click:append="showPass = !showPass"
        :rules="passwordRules"
        :disabled="disabled"
      ></login-input-text>
      <login-avatar-select
        :avatars="avatars"
        :value="$store.state.client.avatar"
        @input="$store.commit('UPDATE_AVATAR', $event)"
        :disabled="disabled"
      ></login-avatar-select>
      <v-row justify="center">
        <v-col cols="auto">
          <icon-btn color="success" :disabled="!valid || disabled" icon="mdi-login" type="submit">Login</icon-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-main>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, reactive, toRefs} from '@vue/composition-api'
import LoginInputText from '@/login/LoginInputText.vue'
import {DEFAULT_PASSWORD} from '@/assets/config/defaults'
import {NAME_FORMAT, SERVER_PASSWORD_FORMAT} from '@/assets/config/formats'
import IconBtn from '@/components/buttons/IconBtn.vue'
import LoginAvatarSelect from '@/login/LoginAvatarSelect.vue'
import {socket} from '@/assets/socket'
import {EventBus} from '@/assets/event'

export default defineComponent({
  components: {
    LoginInputText, IconBtn, LoginAvatarSelect
  },
  setup(_props, context) {
    const state = reactive({
      valid: false,
      password: DEFAULT_PASSWORD,
      showPass: false,
      usernameRules: [
        (v: string): boolean | string => (!!v) || 'Display name required',
        (v: string): boolean | string => NAME_FORMAT.test(v) || 'Display name can only contain: 0-9, A-Z, a-z and space',
        (v: string): boolean | string => (v && v.length <= 20) || 'Display name must be under 20 characters'
      ],
      passwordRules: [
        (v: string): boolean | string => (!!v) || 'Server password required',
        (v: string): boolean | string => SERVER_PASSWORD_FORMAT.test(v) || 'Valid characters A-Z, a-z, 0-9'
      ],
      avatars: ['zero_2', 'lelouch', 'horo', 'madoka', 'alphonse', 'misaka', 'miyu', 'taj'],
      disabled: false
    })

    const passIcon = computed((): string => {
      if (state.showPass) {
        return 'mdi-eye-off'
      }
      return 'mdi-eye'
    })

    const inputType = computed((): string => {
      if (state.showPass) {
        return 'text'
      }
      return 'password'
    })

    function login(): void {
      if (state.valid) {
        state.disabled = true
        localStorage.username = context.root.$store.state.client.username
        localStorage.avatar = context.root.$store.state.client.avatar
        socket.open()
        socket.emit('AUTHENTICATE', state.password, (auth: boolean): void => {
          state.disabled = false
          if (auth) {
            context.root.$store.commit('UPDATE_VIEW', 'lobby')
          }
        })
      }
    }

    onMounted(() => {
      context.root.$store.commit('RESET_CLIENT_STORE_STATE')
      context.root.$store.commit('RESET_STORE_STATE')
      if (socket.connected) {
        socket.disconnect()
      }
      if (!localStorage.GAME_SERVER) {
        EventBus.$emit('SYSTEM_NOTIFICATION', 'error', 'Game server not set. Please set the game server using settings.')
      }
    })

    return {...toRefs(state), passIcon, inputType, login}
  }
})
</script>
