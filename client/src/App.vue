<template>
  <v-app>
    <system-notification></system-notification>
    <v-content>
      <v-btn @click="test()">test</v-btn>
    </v-content>
  </v-app>
</template>

<script lang="ts">
  import {defineComponent, onMounted} from '@vue/composition-api'
  import {socket} from '@/assets/socket'
  import SystemNotification from '@/app/SystemNotification.vue'

  export default defineComponent({
    components: {
      SystemNotification
    },
    setup(props, context) {
      function test() {
        socket.emit('test', 'cheese')
      }

      onMounted(() => {
        socket.on('test', (google: any) => {
          console.log(google)
        })
      })

      return {test}
    }
  })
</script>
