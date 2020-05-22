<template>
  <v-app>
    <system-notification></system-notification>
    <router-view></router-view>
  </v-app>
</template>

<script lang="ts">
  import {defineComponent, onMounted} from '@vue/composition-api'
  import SystemNotification from '@/app/SystemNotification.vue'
  import {socket} from '@/assets/socket'

  export default defineComponent({
    components: {
      SystemNotification
    },
    setup(_props, context) {
      onMounted(() => {
        if (localStorage.dark) {
          context.root.$vuetify.theme.dark = (localStorage.dark === 'true')
        }

        socket.on('disconnect', (): void => {
          if (context.root.$route.path !== '/login') {
            context.root.$router.push('/login')
          }
        })
      })

      return {}
    }
  })
</script>
