<template>
  <v-toolbar-items>
    <nav-btn icon="mdi-cog" color="info" @click="openSettings()"></nav-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import NavBtn from '@/components/buttons/NavBtn.vue'
import {EventBus} from '@/assets/event'

export default defineComponent({
  components: {
    NavBtn
  },
  setup(_props, _context) {
    function openSettings(): void {
      EventBus.$emit('GLOBAL_DIALOG', 'clientSetting', 'Client Settings')
    }

    return {openSettings}
  }
})
</script>
