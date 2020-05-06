<template>
  <v-app>
    <system-notification></system-notification>
    <router-view></router-view>
  </v-app>
</template>

<script lang="ts">
  import {defineComponent, onMounted} from '@vue/composition-api'
  import SystemNotification from '@/app/SystemNotification.vue'

  export default defineComponent({
    components: {
      SystemNotification
    },
    setup(_props, context) {
      onMounted(() => {
        if (localStorage.dark) {
          context.root.$vuetify.theme.dark = (localStorage.dark === 'true')
        }
      })

      return {}
    }
  })
</script>
