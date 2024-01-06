import { UserSongDb } from '../../database/user-song';
import { AnimeIdType, GameRoomSettingsType, SongIdType, SongType, SongTypeType, UserIdType } from '../../shared/models/types';
import { SongDb } from '../../database/song';

abstract class GameListGenerator {
  protected _userSongDb: UserSongDb;
  protected _songDb: SongDb;
  protected _duplicate: boolean;
  protected _songCount: number;
  protected _songType: SongTypeType[];
  protected _players: UserIdType[];
  protected _dupeSongIds: Set<SongIdType>;
  protected _dupeAnimeIds: Set<AnimeIdType>;

  constructor(userSongDb: UserSongDb, songDb: SongDb, settings: GameRoomSettingsType, players: UserIdType[]) {
    this._userSongDb = userSongDb;
    this._songDb = songDb;
    this._duplicate = settings.duplicate;
    this._songCount = settings.songCount;
    this._songType = settings.songType;
    this._players = players;
    this._dupeSongIds = new Set();
    this._dupeAnimeIds = new Set();
  }

  public generate(): SongType[] {
    if (this._players.length <= 0) {
      return [];
    }
    return this._generateList();
  }

  protected abstract _generateList(): SongType[];

  protected _shuffleSongList(songList: SongType[]): SongType[] {
    const shuffledList = [...songList];
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
    return this._shuffleSongList(songList);
  }

  protected _getSongsByUserIds(userIds: UserIdType[]): SongType[] {
    let songIds: SongIdType[] = [];
    for (const userId of userIds) {
      songIds = songIds.concat(this._userSongDb.getUserSongList(userId));
    }
    const songList = this._songDb.getSongListByIds(Array.from(new Set(songIds))).filter((song) => {
      return this._songType.includes(song.type);
    });
    return this._shuffleSongList(songList);
  }
}

export { GameListGenerator };
