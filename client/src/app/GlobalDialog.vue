<template>
  <game-dialog
    :label="label"
    v-model="show"
  >
    <component :is="component"></component>
  </game-dialog>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, reactive, toRefs} from '@vue/composition-api'
import GameDialog from '@/components/GameDialog.vue'
import ClientSettings from '@/app/global-dialog/ClientSettings.vue'
import AdminControls from '@/app/global-dialog/AdminControls.vue'
import {EventBus} from '@/assets/events'

const componentMap: any = {
  clientSettings: ClientSettings,
  admin: AdminControls
}

export default defineComponent({
  components: {
    GameDialog
  },
  setup(_props, _context) {
    const state = reactive({
      show: false,
      dialog: '',
      label: ''
    })

    const component = computed(() => {
      return componentMap[state.dialog]
    })

    onMounted(() => {
      EventBus.$on('GLOBAL_DIALOG', (dialog: string, label: string): void => {
        state.dialog = dialog
        state.label = label
        state.show = true
      })
    })

    return {...toRefs(state), component}
  }
})
</script>
