<template>
  <game-dialog
    v-model="show"
    :width="width"
    :label="label"
  >
    <component :is="component" @dialog:close="show = false"></component>
  </game-dialog>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, toRefs} from '@vue/composition-api'
import GameDialog from '@/components/GameDialog.vue'
import ClientSettings from '@/login/ClientSettings.vue'
import {EventBus} from '@/assets/event'
import AmqSettings from '@/amq-game/AmqSettings.vue'
import AmqSelector from '@/amq-game/AmqSelector.vue'
import AdminControls from '@/app/AdminControls.vue'
import AwqSettings from '@/awq-game/AwqSettings.vue'

let componentMap: {[key: string]: any} = {
  clientSetting: ClientSettings,
  amqSettings: AmqSettings,
  amqSelector: AmqSelector,
  admin: AdminControls,
  awqSettings: AwqSettings
}

export default defineComponent({
  components: {
    GameDialog
  },
  setup(_props, _context) {
    const state = reactive({
      show: false,
      width: '600px',
      label: '',
      dialog: ''
    })

    const component = computed(() => {
      return componentMap[state.dialog]
    })

    EventBus.$on('GLOBAL_DIALOG', (dialog: string, label: string = '', width: string = '600px'): void => {
      state.label = label
      state.width = width
      state.dialog = dialog
      state.show = true
    })

    return {...toRefs(state), component}
  }
})
</script>
