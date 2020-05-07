<template>
  <v-form v-model="valid" @submit.prevent="login()">
    <form-heading>User List</form-heading>
    <form-input-password v-model="password" :disabled="disabled"></form-input-password>
    <form-login-btn :disabled="disabled || !valid"></form-login-btn>
  </v-form>
</template>

<script lang="ts">
  import {defineComponent, reactive, toRefs} from '@vue/composition-api'
  import FormHeading from '@/login/form/FormHeading.vue'
  import FormInputPassword from '@/login/form/FormInputPassword.vue'
  import FormLoginBtn from '@/login/form/FormLoginBtn.vue'
  import {DEFAULT_PASSWORD} from '@/assets/config/defaults'
  import {socket} from '@/assets/socket'

  export default defineComponent({
    components: {
      FormHeading, FormInputPassword, FormLoginBtn
    },
    setup(_props, context) {
      const state = reactive({
        disabled: false,
        password: DEFAULT_PASSWORD,
        valid: false
      })

      function login(): void {
        if (state.valid) {
          state.disabled = true
          socket.open()
          socket.emit('AUTHENTICATE', state.password, (auth: boolean): void => {
            state.disabled = false
            if (auth) {
              socket.emit('LOGIN_LIST_PICKER')
              context.root.$router.push('/list-picker')
            }
          })
        }
      }

      return {...toRefs(state), login}
    }
  })
</script>
