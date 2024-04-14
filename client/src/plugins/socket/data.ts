import { Socket } from 'socket.io-client';
import { useDataStore } from '@/plugins/store/data';
import { pinia } from '@/plugins/store';
import {
  Anime,
  AnimeName,
  BotMessage,
  Emoji,
  SOCKET_EVENTS,
  Song,
  SongId,
  SongStatsRecords,
  SongTitle,
  TAnime,
  TAnimeName,
  TBotMessage,
  TEmoji,
  TSong,
  TSongId,
  TSongStatsRecords,
  TSongTitle,
  TUser,
  User
} from 'anime-quiz-shared-resources';
import { LOCAL_STORAGE_CONSTANTS } from '@/assets/constants';

const dataStore = useDataStore(pinia);

function startDataStoreListeners(socket: Socket): void {
  socket.on(SOCKET_EVENTS.UPDATE_STORE_SONG_LIST, (_songList: TSong[]) => {
    const songList = _songList.map((song) => Song.parse(song));
    dataStore.updateSongList(songList);
    localStorage[LOCAL_STORAGE_CONSTANTS.SONG_LIST] = JSON.stringify(songList);
  });

  socket.on(SOCKET_EVENTS.UPDATE_STORE_ANIME_LIST, (_animeList: TAnime[]) => {
    const animeList = _animeList.map((anime) => Anime.parse(anime));
    dataStore.updateAnimeList(animeList);
    localStorage[LOCAL_STORAGE_CONSTANTS.ANIME_LIST] = JSON.stringify(animeList);
  });

  socket.on(SOCKET_EVENTS.UPDATE_STORE_ANIME_NAMES, (_animeNames: TAnimeName[]) => {
    const animeNames = _animeNames.map((name) => AnimeName.parse(name));
    dataStore.updateAnimeNames(animeNames);
    localStorage[LOCAL_STORAGE_CONSTANTS.ANIME_NAMES] = JSON.stringify(animeNames);
  });

  socket.on(SOCKET_EVENTS.UPDATE_STORE_SONG_TITLES, (_songTitles: TSongTitle[]) => {
    const songTitles = _songTitles.map((title) => SongTitle.parse(title));
    dataStore.updateSongTitles(songTitles);
    localStorage[LOCAL_STORAGE_CONSTANTS.SONG_TITLES] = JSON.stringify(songTitles);
  });

  socket.on(SOCKET_EVENTS.UPDATE_STORE_USER_SONG_LIST, (_userSongList: TSongId[]) => {
    const userSongList = _userSongList.map((id) => SongId.parse(id));
    dataStore.updateUserSongList(userSongList);
  });

  socket.on(SOCKET_EVENTS.UPDATE_STORE_USER_LIST, (_userList: TUser[]) => {
    const userList = _userList.map((user) => User.parse(user));
    dataStore.updateUserList(userList);
  });

  socket.on(SOCKET_EVENTS.UPDATE_STORE_EMOJI_LIST, (_emojiList: TEmoji[]) => {
    const emojiList = _emojiList.map((emoji) => Emoji.parse(emoji));
    dataStore.updateEmojiList(emojiList);
    localStorage[LOCAL_STORAGE_CONSTANTS.EMOJI_LIST] = JSON.stringify(emojiList);
  });

  socket.on(SOCKET_EVENTS.UPDATE_STORE_BOT_MESSAGE_LIST, (_botMessageList: TBotMessage[]) => {
    const botMessageList = _botMessageList.map((botMessage) => BotMessage.parse(botMessage));
    dataStore.updateBotMessageList(botMessageList);
  });

  socket.on(SOCKET_EVENTS.UPDATE_STORE_SONG_STATS_RECORDS, (_songStatsRecords: TSongStatsRecords) => {
    const songStatsRecords = SongStatsRecords.parse(_songStatsRecords);
    dataStore.updateSongStatsRecords(songStatsRecords);
  });

  socket.on(SOCKET_EVENTS.UPDATE_STORE_DATA_VERSION, (dataVersion: string) => {
    dataStore.updateDataVersion(dataVersion);
    localStorage[LOCAL_STORAGE_CONSTANTS.DATA_VERSION] = dataVersion;
  });
}

export { startDataStoreListeners };
