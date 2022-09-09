import { SongDb } from '../../database/song';
import { UserDb } from '../../database/user';
import { IGameSettings, ISong } from '../../shared/interfaces';
import { shuffleSongList } from '../../shared/helpers';

class AbstractGameListGenerator {
  protected _songDb: SongDb;
  protected _userDb: UserDb;
  protected _duplicate: boolean;
  protected _songCount: number;
  protected _users: string[];
  protected _dupeSongIds: Set<string>;
  protected _dupeAnimeIds: Set<string>;
  protected _shuffle: boolean;

  constructor(songDb: SongDb, userDb: UserDb, settings: IGameSettings, shuffle: boolean) {
    this._songDb = songDb;
    this._userDb = userDb;
    this._duplicate = settings.duplicate;
    this._songCount = settings.songCount;
    this._users = settings.users;
    this._dupeSongIds = new Set();
    this._dupeAnimeIds = new Set();
    this._shuffle = shuffle;
  }

  protected _isDupeAnime(song: ISong): boolean {
    if (this._duplicate) {
      return false;
    }

    for (const animeId of song.anime_id) {
      if (this._dupeAnimeIds.has(animeId)) {
        return true;
      }
    }
    return false;
  }

  protected _addDupeAnimeIds(song: ISong): void {
    for (const animeId of song.anime_id) {
      this._dupeAnimeIds.add(animeId);
    }
  }

  protected _addDupeSongId(song: ISong): void {
    this._dupeSongIds.add(song.song_id);
  }

  protected _isDupeSong(song: ISong): boolean {
    return this._dupeSongIds.has(song.song_id);
  }

  protected _initGeneratorVars(): void {}

  protected _generateList(): ISong[] {
    return [];
  }

  public generate(): ISong[] {
    if (this._users.length <= 0) {
      return [];
    }
    this._initGeneratorVars();
    if (this._shuffle) {
      return shuffleSongList(this._generateList());
    }
    return this._generateList();
  }
}

export { AbstractGameListGenerator };
