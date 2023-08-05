import { mainDbConnection, ServerDb, userDbConnection } from './common';
import { ServerConfig } from '../interfaces';
import { Logger } from '../app/logging/logger';
import { DbSong, DbSongTitle } from '../models/song';
import { SongTitleType, SongType } from '../shared/models/types';
import { Song } from '../shared/models/song';
import { DataQualityError } from '../app/exceptions';
import { Database as SqliteDb } from 'better-sqlite3';
import { StatementFactory } from './statement';
import { DbSongType } from '../models/types';

const STATEMENTS = {
  SELECT_ALL_SONG: 'SELECT_ALL_SONG',
  SELECT_ALL_SONG_TITLES: 'SELECT_ALL_SONG_TITLES',
  INSERT_SONG: 'INSERT_SONG',
  INSERT_SONG_ANIME: 'INSERT_SONG_ANIME',
  EDIT_SONG: 'EDIT_SONG',
  DELETE_SONG_ANIME_BY_SONG_ID: 'DELETE_SONG_ANIME_BY_SONG_ID',
  SELECT_SONG_BY_SONG_ID: 'SELECT_SONG_BY_SONG_ID',
  DELETE_SONG: 'DELETE_SONG',
  DELETE_USER_SONGS_BY_SONG_ID: 'DELETE_USER_SONGS_BY_SONG_ID'
};

const MAIN_RAW_STATEMENTS = {
  [STATEMENTS.SELECT_ALL_SONG]: `
    SELECT
      songs.song_id,
      songs.src,
      songs.song_title,
      songs.type,
      songs.artist,
      json_group_array(song_animes.anime_id) as anime_id,
      json_group_array(animes.anime_name) as anime_name
    FROM songs
      LEFT JOIN song_animes ON songs.song_id = song_animes.song_id
      LEFT JOIN animes ON animes.anime_id = song_animes.anime_id
    GROUP BY songs.song_id
  `,
  [STATEMENTS.SELECT_ALL_SONG_TITLES]: `
    SELECT
      song_title
    FROM songs
  `,
  [STATEMENTS.INSERT_SONG]: `
    INSERT INTO songs 
      (song_id, song_title, src, artist, type)
    VALUES
      (@songId, @songTitle, @src, @artist, @type)
  `,
  [STATEMENTS.INSERT_SONG_ANIME]: `
    INSERT INTO song_animes
      (song_id, anime_id)
    VALUES
      (?, ?)
  `,
  [STATEMENTS.EDIT_SONG]: `
    UPDATE songs
    SET
      song_title = @songTitle,
      src = @src,
      artist = @artist,
      type = @type
    WHERE song_id = @songId
  `,
  [STATEMENTS.DELETE_SONG_ANIME_BY_SONG_ID]: `
    DELETE FROM song_animes 
    WHERE song_id = @songId
  `,
  [STATEMENTS.SELECT_SONG_BY_SONG_ID]: `
    SELECT
      *
    FROM songs
    WHERE song_id = @songId
  `,
  [STATEMENTS.DELETE_SONG]: `
    DELETE FROM songs 
    WHERE song_id = @songId
  `
};

const USER_RAW_STATEMENTS = {
  [STATEMENTS.DELETE_USER_SONGS_BY_SONG_ID]: `
    DELETE FROM user_songs 
    WHERE song_id = @songId
  `
};

class SongDb extends ServerDb<SongType> {
  protected _mainDb: SqliteDb;
  protected _userDb: SqliteDb;
  protected _mainFactory: StatementFactory;
  protected _userFactory: StatementFactory;
  protected _songList: SongType[] = [];
  protected _songTitles: SongTitleType[] = [];

  constructor(config: ServerConfig, logger: Logger) {
    super(config, logger);
    this._mainDb = mainDbConnection(null, config);
    this._userDb = userDbConnection(null, config);
    this._mainFactory = new StatementFactory(this._mainDb, MAIN_RAW_STATEMENTS);
    this._userFactory = new StatementFactory(this._userDb, USER_RAW_STATEMENTS);
    this.reloadCache();
  }

  public get songList(): SongType[] {
    return this._songList;
  }

  public get songTitles(): SongTitleType[] {
    return this._songTitles;
  }

  public newRecord(record: SongType) {
    const statement = this._mainFactory.getStatement(STATEMENTS.INSERT_SONG);
    statement.run(record);
    this._newSongAnime(record);
    this.reloadCache();
  }

  public editRecord(record: SongType) {
    const statement = this._mainFactory.getStatement(STATEMENTS.EDIT_SONG);
    statement.run(record);
    this._deleteSongAnime(record);
    this._newSongAnime(record);
    this.reloadCache();
  }

  public deleteRecord(record: SongType) {
    const deleteSongStatement = this._mainFactory.getStatement(STATEMENTS.DELETE_SONG);
    deleteSongStatement.run(record);
    const deleteUserSongStatement = this._userFactory.getStatement(STATEMENTS.DELETE_USER_SONGS_BY_SONG_ID)
    deleteUserSongStatement.run(record)
    this._deleteSongAnime(record);
    this.reloadCache();
  }

  protected _deleteSongAnime(song: SongType) {
    const statement = this._mainFactory.getStatement(STATEMENTS.DELETE_SONG_ANIME_BY_SONG_ID);
    statement.run(song);
  }

  protected _newSongAnime(song: SongType) {
    const statement = this._mainFactory.getStatement(STATEMENTS.INSERT_SONG_ANIME);
    const insertMany = this._mainDb.transaction(() => {
      for (const animeId of song.animeId) {
        statement.run(song.songId, animeId);
      }
    });
    insertMany();
  }

  public validateRecordExists(record: SongType) {
    const statement = this._mainFactory.getStatement(STATEMENTS.SELECT_SONG_BY_SONG_ID);
    const response = statement.get(record);
    if (!response) {
      throw new DataQualityError('Song does not exists');
    }
  }

  public validateRecordNotExists(record: SongType) {
    const statement = this._mainFactory.getStatement(STATEMENTS.SELECT_SONG_BY_SONG_ID);
    const response = statement.get(record);
    if (response) {
      throw new DataQualityError('Song already exists');
    }
  }

  protected _getSongList(): SongType[] {
    const statement = this._mainFactory.getStatement(STATEMENTS.SELECT_ALL_SONG);
    const response = statement.all();
    return response
      .map((item): DbSongType => {
        return DbSong.parse(item);
      })
      .map((dbSong) => {
        const song: SongType = {
          songId: dbSong.song_id,
          songTitle: dbSong.song_title,
          src: dbSong.src,
          artist: dbSong.artist,
          type: dbSong.type,
          animeId: dbSong.anime_id,
          animeName: dbSong.anime_name
        };
        return Song.parse(song);
      });
  }

  protected _getSongTitles(): SongTitleType[] {
    const statement = this._mainFactory.getStatement(STATEMENTS.SELECT_ALL_SONG_TITLES);
    const response = statement.all();
    return Array.from(new Set(response.map((item) => DbSongTitle.parse(item).song_title)));
  }

  public reloadDb() {
    this._mainDb = mainDbConnection(this._mainDb, this._config);
    this._userDb = userDbConnection(this._userDb, this._config);
    this._mainFactory = new StatementFactory(this._mainDb, MAIN_RAW_STATEMENTS);
    this._userFactory = new StatementFactory(this._userDb, USER_RAW_STATEMENTS);
    this.reloadCache();
  }

  public reloadCache() {
    this._songList = this._getSongList();
    this._songTitles = this._getSongTitles();
  }
}

export { SongDb };
