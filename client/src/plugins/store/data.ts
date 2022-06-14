import { DataStoreState, RootStoreState } from '../../assets/interfaces'
import { Module } from 'vuex'
import { MUTATIONS } from './mutations'
import { AqAnime, AqEmoji, AqSong, AqUserSongs } from '../../assets/shared/interfaces'

const DEFAULT_STATE: DataStoreState = {
  songList: [],
  animeList: [],
  songTitleList: [],
  userLists: [],
  emojiList: []
}

const data: Module<DataStoreState, RootStoreState> = {
  state: Object.assign({}, DEFAULT_STATE),
  mutations: {
    [MUTATIONS.SOCKET_UPDATE_SONG_LIST]: (state: DataStoreState, songList: AqSong[]) => {
      state.songList = songList
    },
    [MUTATIONS.SOCKET_UPDATE_ANIME_LIST]: (state: DataStoreState, animeList: AqAnime[]) => {
      state.animeList = animeList
    },
    [MUTATIONS.SOCKET_UPDATE_SONG_TITLE_LIST]: (state: DataStoreState, titleList: string[]) => {
      state.songTitleList = titleList
    },
    [MUTATIONS.SOCKET_UPDATE_USER_LISTS]: (state: DataStoreState, userLists: AqUserSongs[]) => {
      state.userLists = userLists
    },
    [MUTATIONS.SOCKET_UPDATE_EMOJI_LIST]: (state: DataStoreState, emojiList: AqEmoji[]) => {
      state.emojiList = emojiList
    },
    [MUTATIONS.RESET_STORE_STATE]: (state: DataStoreState) => {
      Object.assign(state, DEFAULT_STATE)
    }
  },
  getters: {
    userList:
      (state: DataStoreState): Function =>
      (userId: string): string[] => {
        if (!userId) {
          return []
        }
        const filteredList = state.userLists.filter((userList) => {
          return userList.user_id === userId
        })
        if (filteredList.length > 0) {
          return filteredList[0].song_id
        }
        return []
      },
    userPlaylist:
      (state: DataStoreState): Function =>
      (userId: string): AqSong[] => {
        if (!userId) {
          return []
        }
        const filteredList = state.userLists.filter((userList) => {
          return userList.user_id === userId
        })
        if (filteredList.length > 0) {
          const userSongIds = filteredList[0].song_id
          return state.songList.filter((song) => {
            return userSongIds.includes(song.song_id)
          })
        }
        return []
      },
    songList: (state: DataStoreState): AqSong[] => {
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
    animeList: (state: DataStoreState): string[] => {
      const animeList: Set<string> = new Set()
      for (const anime of state.animeList) {
        for (const animeName of anime.anime_name) {
          animeList.add(animeName)
        }
      }
      return Array.from(animeList).sort()
    },
    songTitleList: (state: DataStoreState): string[] => {
      return [...state.songTitleList].sort()
    },
    adminAnimeList: (state: DataStoreState): AqAnime[] => {
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
    },
    emojiList: (state: DataStoreState): AqEmoji[] => {
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
    userLists: (state: DataStoreState): AqUserSongs[] => {
      return [...state.userLists].sort((a, b) => {
        const nameA = a.username
        const nameB = b.username

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

export { data }
