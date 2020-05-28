<template>
  <v-container fluid>
    <nav-panel show-home>
      <misc-controls></misc-controls>
    </nav-panel>
    <v-content>
      <component :is="component"></component>
    </v-content>
  </v-container>
</template>


<script lang="ts">
  import {computed, defineComponent, onMounted} from '@vue/composition-api'
  import NavPanel from '@/components/NavPanel.vue'
  import MiscControls from '@/misc/MiscControls.vue'
  import Emoji from '@/misc/Emoji.vue'
  import {socket} from '@/assets/socket'

  const componentMap = {
    emoji: Emoji
  }

  export default defineComponent({
    components: {
      NavPanel, MiscControls
    },
    setup(_props, context) {
      const component = computed(() => {
        return componentMap['emoji']
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
