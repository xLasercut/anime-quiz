import { AbstractDb } from '../abstract';
import { IAnime, ISong, ISongTitleRaw } from '../../shared/interfaces';
import { ServerConfig } from '../../app/config';
import { Logger } from '../../app/logging/logger';
import { IAnimeRaw, ISongRaw } from '../../shared/interfaces';
import { shuffleSongList } from '../../shared/helpers';
import { LOG_BASE } from '../../app/logging/log-base';
import { GameDataValidationError } from '../../app/exceptions';
import * as Database from 'better-sqlite3';
import { AnimeRaw } from '../../models/anime';
import { SongRaw, SongTitleRaw } from '../../models/song';
import { GetListAnimeByAnimeIds, GetListSongBySongIds, SongDbStatements } from './sql';

class SongDb extends AbstractDb {
  protected _animeListCache: IAnime[];
  protected _songTitleListCache: string[];
  protected _songListCache: ISong[];
  protected _statements: SongDbStatements;

  constructor(config: ServerConfig, logger: Logger) {
    super(logger, config.mainDbPath);
    this.reloadDb();
    this.reloadCache();
  }

  public reloadDb(): void {
    this._closeDb();
    this._db = new Database(this._filepath, { fileMustExist: true });
    this._statements = new SongDbStatements(this._db);
  }

  public reloadCache(): void {
    this._songTitleListCache = this._getSongTitleList();
    this._animeListCache = this._getAnimeList();
    this._songListCache = this._getSongList();
  }

  public getSongTitleList(): string[] {
    return this._songTitleListCache;
  }

  public getAnimeList(): IAnime[] {
    return this._animeListCache;
  }

  public getSongList(): ISong[] {
    return this._songListCache;
  }

  public newSong(song: ISong): void {
    this._addSong(song);
    this._addSongAnime(song.song_id, song.anime_id);
    this.reloadCache();
  }

  public editSong(song: ISong): void {
    this._editSong(song);
    this._deleteSongAnime(song.song_id);
    this._addSongAnime(song.song_id, song.anime_id);
    this.reloadCache();
  }

  public deleteSong(song: ISong): void {
    this._deleteSong(song.song_id);
    this._deleteSongAnime(song.song_id);
    this.reloadCache();
  }

  public newAnime(anime: IAnime): void {
    this._addAnime(anime.anime_id, anime.anime_name);
    this.reloadCache();
  }

  public editAnime(anime: IAnime): void {
    this._deleteAnime(anime.anime_id);
    this._addAnime(anime.anime_id, anime.anime_name);
    this.reloadCache();
  }

  public deleteAnime(anime: IAnime): void {
    this._deleteAnime(anime.anime_id);
    this.reloadCache();
  }

  protected _deleteAnime(animeId: string): void {
    this._statements.deleteAnimeByAnimeId.run([animeId]);
  }

  protected _addAnime(animeId: string, animeNames: string[]): void {
    const insertAll = this._db.transaction((_animeNames: string[]) => {
      for (const animeName of _animeNames) {
        this._statements.insertAnime.run([animeId, animeName]);
      }
    });
    insertAll(animeNames);
  }

  protected _editSong(song: ISong): void {
    this._statements.updateSongById.run([
      song.song_title,
      song.src,
      song.artist,
      song.type,
      song.song_id
    ]);
  }

  protected _deleteSong(songId: string): void {
    this._statements.deleteSongBySongId.run([songId]);
  }

  protected _deleteSongAnime(songId: string): void {
    this._statements.deleteSongAnimeBySongId.run([songId]);
  }

  protected _addSong(song: ISong): void {
    this._statements.insertSong.run([
      song.song_id,
      song.song_title,
      song.src,
      song.artist,
      song.type
    ]);
  }

  protected _addSongAnime(songId: string, animeIds: string[]): void {
    const insertMany = this._db.transaction((_animeIds: string[]) => {
      for (const animeId of _animeIds) {
        this._statements.insertSongAnime.run([songId, animeId]);
      }
    });
    insertMany(animeIds);
  }

  protected _getSongTitleList(): string[] {
    const songList: ISongTitleRaw[] = this._statements.getAllSongTitle.all();
    return songList.map((song) => {
      return new SongTitleRaw(song).dict().song_title;
    });
  }

  protected _getAnimeList(): IAnime[] {
    const animeList: IAnimeRaw[] = this._statements.getAllAnime.all();
    return animeList.map((anime) => {
      return new AnimeRaw(anime).toAnime().dict();
    });
  }

  protected _getSongList(): ISong[] {
    const songList: ISongRaw[] = this._statements.getAllSong.all();
    return songList.map((song) => {
      return new SongRaw(song).toSong().dict();
    });
  }

  public getSelectedUserSongs(songIds: string[]): ISong[] {
    return shuffleSongList(
      this._songListCache.filter((song) => {
        return songIds.includes(song.song_id);
      })
    );
  }

  public validateAnimesExist(animeIds: string[]): void {
    const existAnimes = new GetListAnimeByAnimeIds(this._db, animeIds.length).all(animeIds);
    if (existAnimes.length < animeIds.length) {
      this._logger.writeLog(LOG_BASE.SONG_DATA_VALIDATION_FAILURE, { animeIds: animeIds });
      throw new GameDataValidationError('Anime does not exist');
    }
  }

  public validateSongsExist(songIds: string[]): void {
    const existSongs = new GetListSongBySongIds(this._db, songIds.length).all(songIds);
    if (existSongs.length !== songIds.length) {
      this._logger.writeLog(LOG_BASE.SONG_DATA_VALIDATION_FAILURE, { songIds: songIds });
      throw new GameDataValidationError('Song does not exist');
    }
  }
}

export { SongDb };
