import { UserSongDb } from '../../database/user-song';
import {
  TAnimeId,
  TCombinedSongStats,
  TGameRoomSettings,
  TSongId,
  TSongStatsPlayCount,
  TSong,
  TSongType,
  TUserId
} from 'anime-quiz-shared-resources/src/models/types';
import { SongDb } from '../../database/song';
import { THandlerDependencies } from '../../interfaces';
import { SongStatsDb } from '../../database/song-stats';
import { Logger } from 'winston';

abstract class GameListGenerator {
  protected _userSongDb: UserSongDb;
  protected _songDb: SongDb;
  protected _songStatsDb: SongStatsDb;
  protected _duplicate: boolean;
  protected _songCount: number;
  protected _leastPlayed: boolean;
  protected _songType: TSongType[];
  protected _players: TUserId[];
  protected _dupeSongIds: Set<TSongId>;
  protected _dupeAnimeIds: Set<TAnimeId>;
  protected _songPlayCounts: { [key: TSongId]: TSongStatsPlayCount } = {};
  protected _maxPlayCount: number = 0;
  protected _logger: Logger;

  constructor(dependencies: THandlerDependencies, settings: TGameRoomSettings, players: TUserId[]) {
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

  public generate(): TSong[] {
    if (this._players.length <= 0) {
      return [];
    }
    return this._generateList();
  }

  protected abstract _generateList(): TSong[];

  protected _shuffleArray<T>(listToShuffle: T[]): T[] {
    const shuffledList = [...listToShuffle];
    for (let i = shuffledList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
    }
    return shuffledList;
  }

  protected _isDupeAnime(song: TSong): boolean {
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

  protected _addDupeAnime(song: TSong) {
    for (const animeId of song.animeId) {
      this._dupeAnimeIds.add(animeId);
    }
  }

  protected _addDupeSong(song: TSong) {
    this._dupeSongIds.add(song.songId);
  }

  protected _isDupeSong(song: TSong): boolean {
    return this._dupeSongIds.has(song.songId);
  }

  protected _getSongsByUserId(userId: TUserId): TSong[] {
    const songIds = this._userSongDb.getUserSongList(userId);
    const songList = this._songDb.getSongListByIds(songIds).filter((song) => {
      return this._songType.includes(song.type);
    });
    const shuffledSongList = this._shuffleArray<TSong>(songList);

    if (this._leastPlayed) {
      return this._sortByLeastPlayed(shuffledSongList);
    }

    return shuffledSongList;
  }

  protected _getSongsByUserIds(userIds: TUserId[]): TSong[] {
    let songIds: TSongId[] = [];
    for (const userId of userIds) {
      songIds = songIds.concat(this._userSongDb.getUserSongList(userId));
    }
    const songList = this._songDb.getSongListByIds(Array.from(new Set(songIds))).filter((song) => {
      return this._songType.includes(song.type);
    });
    const shuffledSongList = this._shuffleArray<TSong>(songList);

    if (this._leastPlayed) {
      return this._sortByLeastPlayed(shuffledSongList);
    }

    return shuffledSongList;
  }

  protected _getPlayCount(song: TSong): TSongStatsPlayCount {
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

  protected _sortByLeastPlayed(songList: TSong[]): TSong[] {
    const songListWithStats: TCombinedSongStats[] = songList.map((song) => {
      return {
        ...song,
        playCount: this._getPlayCount(song)
      };
    });
    const songListWithStatsLeastPlayed: TCombinedSongStats[] = songListWithStats.sort((_, b) => {
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
