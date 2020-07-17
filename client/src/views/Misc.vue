<template>
  <v-container fluid>
    <nav-panel show-home>
      <misc-controls></misc-controls>
    </nav-panel>
    <v-main>
      <component :is="component"></component>
    </v-main>
  </v-container>
</template>


<script lang="ts">
  import {computed, defineComponent, onMounted} from '@vue/composition-api'
  import NavPanel from '@/components/NavPanel.vue'
  import MiscControls from '@/misc/MiscControls.vue'
  import Emoji from '@/misc/Emoji.vue'
  import {socket} from '@/assets/socket'
  import ChatBot from '@/misc/ChatBot.vue'

  const componentMap: { [key: string]: any } = {
    emoji: Emoji,
    chat: ChatBot
  }

  export default defineComponent({
    components: {
      NavPanel, MiscControls
    },
    setup(_props, context) {
      const component = computed(() => {
        return componentMap[context.root.$store.state.misc.miscMode]
      })

      onMounted(() => {
        if (socket.disconnected) {
          context.root.$router.push('/login')
        }
      })

      return {component}
    }
  })
</script>
