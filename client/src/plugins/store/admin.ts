import { AdminStoreState, RootStoreState } from '../../assets/interfaces'
import { Module } from 'vuex'
import { MUTATIONS } from './mutations'

const DEFAULT_STATE: AdminStoreState = {
  animeInEdit: {
    anime_id: '',
    anime_name: []
  },
  songInEdit: {
    anime_id: [],
    anime_name: [],
    src: '',
    song_id: '',
    song_title: '',
    artist: '',
    type: ''
  },
  emojiInEdit: {
    emoji_id: '',
    command: '',
    src: '',
    type: ''
  },
  userInEdit: {
    user_id: '',
    username: '',
    song_id: []
  }
}

const admin: Module<AdminStoreState, RootStoreState> = {
  state: Object.assign({}, DEFAULT_STATE),
  mutations: {
    [MUTATIONS.RESET_STORE_STATE]: (state: AdminStoreState) => {
      Object.assign(state, DEFAULT_STATE)
    },
    [MUTATIONS.ADMIN_UPDATE_ANIME_ID]: (state: AdminStoreState, animeId: string) => {
      state.animeInEdit.anime_id = animeId
    },
    [MUTATIONS.ADMIN_UPDATE_ANIME_NAME]: (state: AdminStoreState, animeNames: string[]) => {
      state.animeInEdit.anime_name = animeNames
    },
    [MUTATIONS.ADMIN_UPDATE_SONG_ID]: (state: AdminStoreState, songId: string) => {
      state.songInEdit.song_id = songId
    },
    [MUTATIONS.ADMIN_UPDATE_SONG_SRC]: (state: AdminStoreState, src: string) => {
      state.songInEdit.src = src
    },
    [MUTATIONS.ADMIN_UPDATE_SONG_ARTIST]: (state: AdminStoreState, artist: string) => {
      state.songInEdit.artist = artist
    },
    [MUTATIONS.ADMIN_UPDATE_SONG_TITLE]: (state: AdminStoreState, title: string) => {
      state.songInEdit.song_title = title
    },
    [MUTATIONS.ADMIN_UPDATE_SONG_ANIME_ID]: (state: AdminStoreState, animeIds: string[]) => {
      state.songInEdit.anime_id = animeIds
    },
    [MUTATIONS.ADMIN_UPDATE_SONG_ANIME_NAME]: (state: AdminStoreState, animeNames: string[]) => {
      state.songInEdit.anime_name = animeNames
    },
    [MUTATIONS.ADMIN_UPDATE_SONG_TYPE]: (state: AdminStoreState, type: string) => {
      state.songInEdit.type = type
    },
    [MUTATIONS.ADMIN_UPDATE_EMOJI_SRC]: (state: AdminStoreState, src: string) => {
      state.emojiInEdit.src = src
    },
    [MUTATIONS.ADMIN_UPDATE_EMOJI_COMMAND]: (state: AdminStoreState, command: string) => {
      state.emojiInEdit.command = command
    },
    [MUTATIONS.ADMIN_UPDATE_EMOJI_TYPE]: (state: AdminStoreState, type: string) => {
      state.emojiInEdit.type = type
    },
    [MUTATIONS.ADMIN_UPDATE_EMOJI_ID]: (state: AdminStoreState, id: string) => {
      state.emojiInEdit.emoji_id = id
    },
    [MUTATIONS.ADMIN_UPDATE_USER_NAME]: (state: AdminStoreState, username: string) => {
      state.userInEdit.username = username
    },
    [MUTATIONS.ADMIN_UPDATE_USER_ID]: (state: AdminStoreState, userId: string) => {
      state.userInEdit.user_id = userId
    }
  }
}

export { admin }
