import { SetupContext } from '@vue/composition-api'
function newTableHelpers(context: SetupContext) {
  function updateFilter(prop: string, event: string | null): void {
    const cleanedEvent = event || ''
    context.emit(`update:${prop}`, cleanedEvent.trim())
  }

  return {
    updateFilter
  }
}


export {
  newTableHelpers
}
