<template>
  <v-form v-model="valid" @submit.prevent="login()">
    <form-heading>Game</form-heading>
    <form-input
      label="Display Name" counter="20"
      :value="$store.state.client.username"
      @input="$store.commit('UPDATE_USERNAME', $event)"
      :disabled="disabled"
      :rules="nameRules"
    ></form-input>
    <form-input-password
      v-model="password"
      :disabled="disabled"
    ></form-input-password>
    <form-avatar
      :disabled="disabled" :avatars="avatars"
      :value="$store.state.client.avatar"
      @input="$store.commit('UPDATE_AVATAR', $event)"
    ></form-avatar>
    <form-login-btn :disabled="disabled || !valid"></form-login-btn>
  </v-form>
</template>

<script lang="ts">
  import {defineComponent, reactive, toRefs} from '@vue/composition-api'
  import FormInputPassword from '@/login/form/FormInputPassword.vue'
  import FormInput from '@/login/form/FormInput.vue'
  import FormHeading from '@/login/form/FormHeading.vue'
  import FormLoginBtn from '@/login/form/FormLoginBtn.vue'
  import {DEFAULT_PASSWORD} from '@/assets/config/defaults'
  import FormAvatar from '@/login/form/FormAvatar.vue'
  import {socket} from '@/assets/socket'

  const USERNAME_FORMAT = new RegExp('^[A-Za-z0-9 ]+$')

  export default defineComponent({
    components: {
      FormHeading, FormInput, FormInputPassword, FormLoginBtn, FormAvatar
    },
    setup(_props, context) {
      const state = reactive({
        username: '',
        password: DEFAULT_PASSWORD,
        disabled: false,
        avatars: ['zero_2', 'lelouch', 'horo', 'madoka', 'alphonse', 'misaka', 'miyu', 'taj'],
        valid: false,
        nameRules: [
          (v: string): boolean | string => (!!v) || 'Display name required',
          (v: string): boolean | string => USERNAME_FORMAT.test(v) || 'Display name can only contain: 0-9, A-Z, a-z and space',
          (v: string): boolean | string => (v && v.length <= 20) || 'Display name must be under 20 characters'
        ]
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
              context.root.$router.push('/game')
            }
          })
        }
      }

      return {...toRefs(state), login}
    }
  })
</script>
