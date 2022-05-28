import { Component } from 'vue/types/options'
import { ROUTES } from './routes'
import FileSelect from '../../views/FileSelect.vue'
import { store } from '../store'


const _VIEW_MAPPING: { [key: string]: Component } = {
  [ROUTES.FILE_SELECT]: FileSelect
}

function viewComponent(): any {
  return _VIEW_MAPPING[store.state.view]
}

export {
  viewComponent
}
