import { DatabaseDataState, mainDbConnection, ServerDb, userDbConnection } from './common';
import { TServerConfig } from '../interfaces';

import { DbSong, DbSongTitle } from '../models/song';
import { Song, TSong, TSongId, TSongTitle } from 'anime-quiz-shared-resources';
import { DataQualityError } from '../app/exceptions';
import { Database as SqliteDb } from 'better-sqlite3';
import { StatementFactory } from './statement';
import { TDbSong } from '../models/types';
import { Logger } from 'winston';

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
      songs.audio_src,
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
      (song_id, song_title, src, artist, type, audio_src)
    VALUES
      (@songId, @songTitle, @src, @artist, @type, @audioSrc)
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
      type = @type,
      audio_src = @audioSrc
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

class SongDb extends ServerDb<TSong> {
  protected _mainDb: SqliteDb;
  protected _userDb: SqliteDb;
  protected _mainFactory: StatementFactory;
  protected _userFactory: StatementFactory;
  protected _songList: TSong[] = [];
  protected _songTitles: TSongTitle[] = [];

  constructor(config: TServerConfig, logger: Logger, state: DatabaseDataState) {
    super(config, logger, state);
    this._mainDb = mainDbConnection(null, config);
    this._userDb = userDbConnection(null, config);
    this._mainFactory = new StatementFactory(this._mainDb, MAIN_RAW_STATEMENTS);
    this._userFactory = new StatementFactory(this._userDb, USER_RAW_STATEMENTS);
    this.reloadCache();
  }

  public get songList(): TSong[] {
    return this._songList;
  }

  public get songTitles(): TSongTitle[] {
    return this._songTitles;
  }

  public getSongListByIds(songIds: TSongId[]): TSong[] {
    return this._songList.filter((song) => {
      return songIds.includes(song.songId);
    });
  }

  public newRecord(record: TSong) {
    const statement = this._mainFactory.getStatement(STATEMENTS.INSERT_SONG);
    statement.run(record);
    this._newSongAnime(record);
    this.reloadCache();
  }

  public editRecord(record: TSong) {
    const statement = this._mainFactory.getStatement(STATEMENTS.EDIT_SONG);
    statement.run(record);
    this._deleteSongAnime(record);
    this._newSongAnime(record);
    this.reloadCache();
  }

  public deleteRecord(record: TSong) {
    const deleteSongStatement = this._mainFactory.getStatement(STATEMENTS.DELETE_SONG);
    deleteSongStatement.run(record);
    const deleteUserSongStatement = this._userFactory.getStatement(STATEMENTS.DELETE_USER_SONGS_BY_SONG_ID);
    deleteUserSongStatement.run(record);
    this._deleteSongAnime(record);
    this.reloadCache();
  }

  protected _deleteSongAnime(song: TSong) {
    const statement = this._mainFactory.getStatement(STATEMENTS.DELETE_SONG_ANIME_BY_SONG_ID);
    statement.run(song);
  }

  protected _newSongAnime(song: TSong) {
    const statement = this._mainFactory.getStatement(STATEMENTS.INSERT_SONG_ANIME);
    const insertMany = this._mainDb.transaction(() => {
      for (const animeId of song.animeId) {
        statement.run(song.songId, animeId);
      }
    });
    insertMany();
  }

  public validateRecordExists(record: TSong) {
    const statement = this._mainFactory.getStatement(STATEMENTS.SELECT_SONG_BY_SONG_ID);
    const response = statement.get(record);
    if (!response) {
      throw new DataQualityError('Song does not exists');
    }
  }

  public validateRecordNotExists(record: TSong) {
    const statement = this._mainFactory.getStatement(STATEMENTS.SELECT_SONG_BY_SONG_ID);
    const response = statement.get(record);
    if (response) {
      throw new DataQualityError('Song already exists');
    }
  }

  protected _getSongList(): TSong[] {
    const statement = this._mainFactory.getStatement(STATEMENTS.SELECT_ALL_SONG);
    const response = statement.all();
    return response
      .map((item): TDbSong => {
        return DbSong.parse(item);
      })
      .map((dbSong) => {
        const song: TSong = {
          songId: dbSong.song_id,
          songTitle: dbSong.song_title,
          src: dbSong.src,
          artist: dbSong.artist,
          type: dbSong.type,
          animeId: dbSong.anime_id,
          animeName: dbSong.anime_name,
          audioSrc: dbSong.audio_src
        };
        return Song.parse(song);
      });
  }

  protected _getSongTitles(): TSongTitle[] {
    const statement = this._mainFactory.getStatement(STATEMENTS.SELECT_ALL_SONG_TITLES);
    const response = statement.all();
    const existingSongTitles: Set<TSongTitle> = new Set();
    const songTitles: TSongTitle[] = [];
    for (const item of response) {
      const parsedSongTitle = DbSongTitle.parse(item).song_title;
      if (existingSongTitles.has(parsedSongTitle.toLowerCase())) {
        continue;
      }
      existingSongTitles.add(parsedSongTitle.toLowerCase());
      songTitles.push(parsedSongTitle);
    }
    return songTitles;
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
    this._state.updateState();
  }
}

export { SongDb };
