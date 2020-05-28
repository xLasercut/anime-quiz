<template>
  <v-toolbar-items>
    <nav-btn color="warning" icon="mdi-sticker-emoji" @click="changeMiscMode('emoji')"></nav-btn>
    <nav-btn color="primary" icon="mdi-robot" @click="changeMiscMode('chat')"></nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api'
  import NavBtn from '@/components/buttons/NavBtn.vue'
  import {IMiscMode} from '@/assets/types'

  export default defineComponent({
    components: {
      NavBtn
    },
    setup(_props, context) {
      function changeMiscMode(mode: IMiscMode): void {
        context.root.$store.commit('UPDATE_MISC_MODE', mode)
      }

      return {changeMiscMode}
    }
  })
</script>
