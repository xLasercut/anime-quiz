<template>
  <v-container>
    <nav-panel>
      <login-controls></login-controls>
    </nav-panel>
    <v-main>
      <component :is="component"></component>
    </v-main>
  </v-container>
</template>

<script lang="ts">
  import {computed, defineComponent, onMounted} from '@vue/composition-api'
  import NavPanel from '@/components/NavPanel.vue'
  import ListPickerLogin from '@/login/ListPickerLogin.vue'
  import LoginControls from '@/login/LoginControls.vue'
  import {socket} from '@/assets/socket'
  import GameLogin from '@/login/GameLogin.vue'
  import MiscLogin from '@/login/MiscLogin.vue'

  const componentMap: { [key: string]: any } = {
    list: ListPickerLogin,
    game: GameLogin,
    misc: MiscLogin
  }

  export default defineComponent({
    components: {
      NavPanel, LoginControls
    },
    setup(_props, context) {
      const component = computed(() => {
        return componentMap[context.root.$store.state.client.loginMode]
      })

      onMounted(() => {
        if (socket.connected) {
          socket.close()
        }

        context.root.$store.commit('RESET_STORE_STATE')

        if (localStorage.username) {
          context.root.$store.commit('UPDATE_USERNAME', localStorage.username)
        }

        if (localStorage.avatar) {
          context.root.$store.commit('UPDATE_AVATAR', localStorage.avatar)
        }
      })

      return {component}
    }
  })
</script>
