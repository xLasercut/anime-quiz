<template>
  <v-container>
    <nav-panel>
      <login-controls></login-controls>
    </nav-panel>
    <v-content>
      <component :is="component"></component>
    </v-content>
  </v-container>
</template>

<script lang="ts">
  import {computed, defineComponent} from '@vue/composition-api'
  import NavPanel from '@/components/NavPanel.vue'
  import ListPickerLogin from '@/login/ListPickerLogin.vue'
  import LoginControls from '@/login/LoginControls.vue'

  const componentMap: {[key: string]: any} = {
    'list': ListPickerLogin
  }

  export default defineComponent({
    components:{
      NavPanel, LoginControls
    },
    setup(_props, context) {
      const component = computed(() => {
        return componentMap[context.root.$store.state.client.loginMode]
      })

      return {component}
    }
  })
</script>
