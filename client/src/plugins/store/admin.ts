import { AdminStoreState, RootStoreState } from '../../assets/interfaces'
import { Module } from 'vuex'
import { MUTATIONS } from './mutations'
import { AqAnime, AqEmoji, AqSong } from '../../assets/shared/interfaces'

const DEFAULT_STATE: AdminStoreState = {
  animeList: [],
  animeInEdit: {
    anime_id: '',
    anime_name: []
  },
  songList: [],
  songInEdit: {
    anime_id: [],
    anime_name: [],
    src: '',
    song_id: '',
    song_title: '',
    artist: '',
    type: ''
  },
  emojiList: [],
  emojiInEdit: {
    emoji_id: '',
    command: '',
    src: '',
    type: ''
  }
}

const admin: Module<AdminStoreState, RootStoreState> = {
  state: Object.assign({}, DEFAULT_STATE),
  mutations: {
    [MUTATIONS.RESET_STORE_STATE]: (state: AdminStoreState) => {
      Object.assign(state, DEFAULT_STATE)
    },
    [MUTATIONS.SOCKET_ADMIN_UPDATE_ANIME_LIST]: (state: AdminStoreState, animeList: AqAnime[]) => {
      state.animeList = animeList
    },
    [MUTATIONS.SOCKET_ADMIN_UPDATE_SONG_LIST]: (state: AdminStoreState, songList: AqSong[]) => {
      state.songList = songList
    },
    [MUTATIONS.SOCKET_ADMIN_UPDATE_EMOJI_LIST]: (state: AdminStoreState, emojiList: AqEmoji[]) => {
      state.emojiList = emojiList
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
    }
  },
  getters: {
    adminSongList: (state: AdminStoreState): AqSong[] => {
      return [...state.songList].sort((a, b) => {
        const animeA = a.anime_name[0]
        const animeB = b.anime_name[0]

        if (animeA === animeB) {
          return 0
        } else if (animeA > animeB) {
          return 1
        }
        return -1
      })
    },
    adminEmojiList: (state: AdminStoreState): AqEmoji[] => {
      return [...state.emojiList].sort((a, b) => {
        const commandA = a.command
        const commandB = b.command

        if (commandA === commandB) {
          return 0
        } else if (commandA > commandB) {
          return 1
        }
        return -1
      })
    },
    adminAnimeList: (state: AdminStoreState): AqAnime[] => {
      return [...state.animeList].sort((a, b) => {
        const nameA = a.anime_name
        const nameB = b.anime_name

        if (nameA === nameB) {
          return 0
        } else if (nameA > nameB) {
          return 1
        }
        return -1
      })
    }
  }
}

export {
  admin
}
