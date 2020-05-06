<template>
  <v-toolbar-items>
    <nav-btn color="success" icon="mdi-gamepad-variant" @click="changeLogin('game')"></nav-btn>
    <nav-btn color="primary" icon="mdi-playlist-music" @click="changeLogin('list')"></nav-btn>
    <nav-btn color="warning" icon="mdi-sticker-emoji" @click="changeLogin('misc')"></nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'
  import NavBtn from '../components/buttons/NavBtn.vue'
  import {ILoginMode} from '@/assets/types'

  export default defineComponent({
    components: {
      NavBtn
    },
    setup(_props, context) {
      function changeLogin(mode: ILoginMode): void {
        context.root.$store.commit('CHANGE_LOGIN_MODE', mode)
      }

      return {changeLogin}
    }
  })
</script>
