import {IAiqStoreState, IAiqImageListFilter, IRootStoreState} from '@/assets/interfaces'
import {Module} from 'vuex'
import {IAiqChoices, IAiqImage} from '../../../shared/interfaces/database'
import {IAiqPlayer, IAiqSettings} from '../../../shared/interfaces/aiq'

function _getDefaultState(): IAiqStoreState {
  return {
    host: false,
    imageList: [],
    choices: {
      anime: [],
      name: []
    },
    imageListFilter: {
      anime: '',
      name: ''
    },
    settings: {
      guessTime: 10,
      duplicate: false,
      imageCount: 20,
      minFactor: 30,
      maxFactor: 100
    },
    gameState: {
      playing: false,
      currentImageCount: 0,
      maxImageCount: 0,
      currentImage: {
        imageId: '',
        anime: [''],
        src: '',
        name: ''
      }
    },
    playerList: []
  }
}

const aiq: Module<IAiqStoreState, IRootStoreState> = {
  state: _getDefaultState(),
  mutations: {
    RESET_STORE_STATE(state: IAiqStoreState): void {
      Object.assign(state, _getDefaultState())
    },
    UPDATE_AIQ_IMAGE_LIST_FILTER(state: IAiqStoreState, imageListFilter: IAiqImageListFilter): void {
      state.imageListFilter = imageListFilter
    },
    SOCKET_UPDATE_AIQ_IMAGE_LIST(state: IAiqStoreState, imageList: Array<IAiqImage>): void {
      state.imageList = imageList
    },
    SOCKET_UPDATE_AIQ_CHOICES(state: IAiqStoreState, choices: IAiqChoices): void {
      state.choices = choices
    },
    SOCKET_UPDATE_AIQ_HOST(state: IAiqStoreState, host: boolean): void {
      state.host = host
    },
    SOCKET_UPDATE_AIQ_PLAYER_LIST(state: IAiqStoreState, playerList: Array<IAiqPlayer>): void {
      state.playerList = playerList
    },
    SOCKET_UPDATE_AIQ_SETTINGS(state: IAiqStoreState, settings: IAiqSettings): void {
      state.settings = settings
    }
  },
  getters: {
    filteredAiqImageList: (state: IAiqStoreState): Array<IAiqImage> => {
      let animeFilter = state.imageListFilter.anime.trim().toLowerCase()
      let nameFilter = state.imageListFilter.name.trim().toLowerCase()

      return state.imageList
        .filter((image: IAiqImage) => {
          if (image.anime.join(',').toLowerCase().includes(animeFilter) &&
            image.name.toLowerCase().includes(nameFilter)) {
            return image
          }
        })
        .sort((a: IAiqImage, b: IAiqImage) => {
          let animeA = a.anime[0]
          let animeB = b.anime[0]
          let nameA = a.name
          let nameB = b.name

          if (animeA === animeB) {
            if (nameA > nameB) {
              return 1
            }
            else if (nameA < nameB) {
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

export default aiq
