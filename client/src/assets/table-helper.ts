import { ref, SetupContext } from '@vue/composition-api'

function newTableHelpers(context: SetupContext) {
  const editActionDisabled = ref(false)

  function editActionComplete(proceed: boolean): void {
    if (proceed) {
      context.emit('dialog:close')
    }
    editActionDisabled.value = false
  }

  function updateFilter(prop: string, event: string | null): void {
    const cleanedEvent = event || ''
    context.emit(`update:${prop}`, cleanedEvent.trim())
  }

  return {
    updateFilter,
    editActionDisabled,
    editActionComplete
  }
}

export {
  newTableHelpers
}
