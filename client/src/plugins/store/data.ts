import { defineStore } from 'pinia';
import {
  AnimeIdType,
  AnimeNameType,
  AnimeType,
  BotMessageType,
  EmojiType,
  SongIdType,
  SongStatsType,
  SongTitleType,
  SongType,
  UserType
} from '@/assets/shared/models/types';
import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';

interface State {
  songList: SongType[];
  animeList: AnimeType[];
  songTitles: SongTitleType[];
  animeNames: AnimeNameType[];
  userSongList: SongIdType[];
  userList: UserType[];
  emojiList: EmojiType[];
  botMessageList: BotMessageType[];
  songStatsList: SongStatsType[];
  dataVersion: string;
}

interface AnimeString {
  animeId: AnimeIdType;
  animeName: string;
}

const useDataStore = defineStore('data', {
  state: (): State => {
    return {
      songList: JSON.parse(localStorage[LOCAL_STORAGE_CONSTANTS.SONG_LIST] || '[]'),
      animeList: JSON.parse(localStorage[LOCAL_STORAGE_CONSTANTS.ANIME_LIST] || '[]'),
      songTitles: JSON.parse(localStorage[LOCAL_STORAGE_CONSTANTS.SONG_TITLES] || '[]'),
      animeNames: JSON.parse(localStorage[LOCAL_STORAGE_CONSTANTS.ANIME_NAMES] || '[]'),
      userSongList: [],
      userList: [],
      emojiList: JSON.parse(localStorage[LOCAL_STORAGE_CONSTANTS.EMOJI_LIST] || '[]'),
      botMessageList: [],
      dataVersion: localStorage[LOCAL_STORAGE_CONSTANTS.DATA_VERSION] || '',
      songStatsList: []
    };
  },
  actions: {
    updateSongList(songList: SongType[]) {
      this.songList = songList.sort((a, b) => {
        const animeA = a.animeName[0];
        const animeB = b.animeName[0];

        if (animeA === animeB) {
          return 0;
        }
        if (animeA > animeB) {
          return 1;
        }
        return -1;
      });
    },
    updateAnimeList(animeList: AnimeType[]) {
      this.animeList = animeList;
    },
    updateSongTitles(songTitles: SongTitleType[]) {
      this.songTitles = songTitles.sort();
    },
    updateAnimeNames(animeNames: AnimeNameType[]) {
      this.animeNames = animeNames.sort();
    },
    updateUserSongList(userSongList: SongIdType[]) {
      this.userSongList = userSongList;
    },
    updateUserList(userList: UserType[]) {
      this.userList = userList;
    },
    updateEmojiList(emojiList: EmojiType[]) {
      this.emojiList = emojiList.sort((a, b) => {
        if (a.command === b.command) {
          return 0;
        }
        if (a.command > b.command) {
          return 1;
        }
        return -1;
      });
    },
    updateBotMessageList(botMessageList: BotMessageType[]) {
      this.botMessageList = botMessageList.sort((a, b) => {
        if (a.displayName === b.displayName) {
          return 0;
        }
        if (a.displayName > b.displayName) {
          return 1;
        }
        return -1;
      });
    },
    updateSongStatsList(songStatsList: SongStatsType[]) {
      this.songStatsList = songStatsList;
    },
    updateDataVersion(dataVersion: string) {
      this.dataVersion = dataVersion;
    }
  },
  getters: {
    animeStringList(): AnimeString[] {
      return this.animeList.map((anime) => {
        return {
          animeId: anime.animeId,
          animeName: anime.animeName.join(',')
        };
      });
    },
    getSongStats: (state) => {
      return (song: SongType): SongStatsType | null => {
        for (const songStats of state.songStatsList) {
          if (song.songId === songStats.songId) {
            return songStats;
          }
        }
        return null;
      };
    }
  }
});

export { useDataStore };
