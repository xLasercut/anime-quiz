import {IAwqStoreState, IAwqWeaponListFilter, IRootStoreState} from '@/assets/interfaces'
import {Module} from 'vuex'
import {IAwqChoices, IAwqWeapon} from '../../../shared/interfaces/database'

function _getDefaultState(): IAwqStoreState {
  return {
    host: false,
    weaponList: [],
    choices: {
      anime: [],
      weapon: []
    },
    weaponListFilter: {
      anime: '',
      weapon: ''
    }
  }
}

const awq: Module<IAwqStoreState, IRootStoreState> = {
  state: _getDefaultState(),
  mutations: {
    RESET_STORE_STATE(state: IAwqStoreState): void {
      Object.assign(state, _getDefaultState())
    },
    UPDATE_AWQ_WEAPON_LIST_FILTER(state: IAwqStoreState, weaponListFilter: IAwqWeaponListFilter): void {
      state.weaponListFilter = weaponListFilter
    },
    SOCKET_UPDATE_AWQ_WEAPON_LIST(state: IAwqStoreState, weaponList: Array<IAwqWeapon>): void {
      state.weaponList = weaponList
    },
    SOCKET_UPDATE_AWQ_CHOICES(state: IAwqStoreState, choices: IAwqChoices): void {
      state.choices = choices
    }
  },
  getters: {
    filteredAwqWeaponList: (state: IAwqStoreState): Array<IAwqWeapon> => {
      let animeFilter = state.weaponListFilter.anime.trim().toLowerCase()
      let weaponFilter = state.weaponListFilter.weapon.trim().toLowerCase()

      return state.weaponList
        .filter((song: IAwqWeapon) => {
          if (song.anime.join(',').toLowerCase().includes(animeFilter) &&
            song.name.toLowerCase().includes(weaponFilter)) {
            return song
          }
        })
        .sort((a: IAwqWeapon, b: IAwqWeapon) => {
          let animeA = a.anime[0]
          let animeB = b.anime[0]
          let weaponA = a.name
          let weaponB = b.name

          if (animeA === animeB) {
            if (weaponA > weaponB) {
              return 1
            }
            else if (weaponA < weaponB) {
              return -1
            }
            return 0
          }
          else if (animeA > animeB) {
            return 1
          }
          return -1
        })
    },
  }
}

export default awq
