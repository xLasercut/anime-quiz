<template>
  <form-input
    label="Server Password"
    :rules="rules" :append-icon="icon"
    @click:append="togglePass()"
    :type="inputType"
    :value="value" @input="$emit('input', $event)"
  ></form-input>
</template>

<script lang="ts">
  import {computed, defineComponent, reactive, toRefs} from '@vue/composition-api'
  import FormInput from '@/login/form/FormInput.vue'

  const SERVER_PASSWORD_FORMAT = new RegExp('^[A-Za-z0-9]+$')

  export default defineComponent({
    components: {
      FormInput
    },
    props: {
      value: {
        required: true
      }
    },
    setup(_props, _context) {
      const state = reactive({
        showPass: false,
        rules: [
          (v: string): boolean | string => (!!v) || 'Server password required',
          (v: string): boolean | string => SERVER_PASSWORD_FORMAT.test(v) || 'Valid characters A-Z, a-z, 0-9'
        ]
      })

      const icon = computed((): string => {
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

      function togglePass(): void {
        state.showPass = !state.showPass
      }

      return {...toRefs(state), icon, togglePass, inputType}
    }
  })
</script>
