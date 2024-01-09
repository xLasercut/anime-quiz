import { UserSongDb } from '../../database/user-song';
import {
  AnimeIdType,
  CombinedSongStatsType,
  GameRoomSettingsType,
  SongIdType,
  SongStatsPlayCountType,
  SongType,
  SongTypeType,
  UserIdType
} from '../../shared/models/types';
import { SongDb } from '../../database/song';
import { HandlerDependencies } from '../../interfaces';
import { SongStatsDb } from '../../database/song-stats';
import { Logger } from '../../app/logger';

abstract class GameListGenerator {
  protected _userSongDb: UserSongDb;
  protected _songDb: SongDb;
  protected _songStatsDb: SongStatsDb;
  protected _duplicate: boolean;
  protected _songCount: number;
  protected _leastPlayed: boolean;
  protected _songType: SongTypeType[];
  protected _players: UserIdType[];
  protected _dupeSongIds: Set<SongIdType>;
  protected _dupeAnimeIds: Set<AnimeIdType>;
  protected _songPlayCounts: { [key: SongIdType]: SongStatsPlayCountType } = {};
  protected _maxPlayCount: number = 0;
  protected _logger: Logger;

  constructor(dependencies: HandlerDependencies, settings: GameRoomSettingsType, players: UserIdType[]) {
    this._logger = dependencies.logger;
    this._userSongDb = dependencies.userSongDb;
    this._songDb = dependencies.songDb;
    this._songStatsDb = dependencies.songStatsDb;
    this._duplicate = settings.duplicate;
    this._songCount = settings.songCount;
    this._songType = settings.songType;
    this._leastPlayed = settings.leastPlayed;
    this._players = players;
    this._dupeSongIds = new Set();
    this._dupeAnimeIds = new Set();
    this._initSongStats();
  }

  public generate(): SongType[] {
    if (this._players.length <= 0) {
      return [];
    }
    return this._generateList();
  }

  protected abstract _generateList(): SongType[];

  protected _shuffleArray<T>(listToShuffle: T[]): T[] {
    const shuffledList = [...listToShuffle];
    for (let i = shuffledList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
    }
    return shuffledList;
  }

  protected _isDupeAnime(song: SongType): boolean {
    if (this._duplicate) {
      return false;
    }

    for (const animeId of song.animeId) {
      if (this._dupeAnimeIds.has(animeId)) {
        return true;
      }
    }

    return false;
  }

  protected _addDupeAnime(song: SongType) {
    for (const animeId of song.animeId) {
      this._dupeAnimeIds.add(animeId);
    }
  }

  protected _addDupeSong(song: SongType) {
    this._dupeSongIds.add(song.songId);
  }

  protected _isDupeSong(song: SongType): boolean {
    return this._dupeSongIds.has(song.songId);
  }

  protected _getSongsByUserId(userId: UserIdType): SongType[] {
    const songIds = this._userSongDb.getUserSongList(userId);
    const songList = this._songDb.getSongListByIds(songIds).filter((song) => {
      return this._songType.includes(song.type);
    });
    const shuffledSongList = this._shuffleArray<SongType>(songList);

    if (this._leastPlayed) {
      return this._sortByLeastPlayed(shuffledSongList);
    }

    return shuffledSongList;
  }

  protected _getSongsByUserIds(userIds: UserIdType[]): SongType[] {
    let songIds: SongIdType[] = [];
    for (const userId of userIds) {
      songIds = songIds.concat(this._userSongDb.getUserSongList(userId));
    }
    const songList = this._songDb.getSongListByIds(Array.from(new Set(songIds))).filter((song) => {
      return this._songType.includes(song.type);
    });
    const shuffledSongList = this._shuffleArray<SongType>(songList);

    if (this._leastPlayed) {
      return this._sortByLeastPlayed(shuffledSongList);
    }

    return shuffledSongList;
  }

  protected _getPlayCount(song: SongType): SongStatsPlayCountType {
    return this._songPlayCounts[song.songId] || 0;
  }

  protected _initSongStats() {
    const songStatsList = this._songStatsDb.getSongStats();
    for (const songStats of songStatsList) {
      this._songPlayCounts[songStats.songId] = songStats.playCount;
    }
    if (songStatsList.length > 0) {
      this._maxPlayCount = Math.max(...Object.values(this._songPlayCounts));
    }
    this._logger.debug('loaded song stats', {
      maxPlayCount: this._maxPlayCount
    });
  }

  protected _sortByLeastPlayed(songList: SongType[]): SongType[] {
    const songListWithStats: CombinedSongStatsType[] = songList.map((song) => {
      return {
        ...song,
        playCount: this._getPlayCount(song)
      };
    });
    const songListWithStatsLeastPlayed: CombinedSongStatsType[] = songListWithStats.sort((_, b) => {
      if (b.playCount - this._maxPlayCount > -5) {
        return -1;
      }

      return 0;
    });
    return songListWithStatsLeastPlayed.map((item) => {
      const { playCount, ...rest } = item;
      return {
        ...rest
      };
    });
  }
}

export { GameListGenerator };
