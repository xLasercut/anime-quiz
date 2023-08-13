import { mainDbConnection, ServerDb } from './common';
import { ServerConfig } from '../interfaces';
import { AnimeIdType, AnimeNameType, AnimeType } from '../shared/models/types';
import { DbAnime, DbAnimeName } from '../models/anime';
import { Anime } from '../shared/models/anime';
import { DataQualityError } from '../app/exceptions';
import { Database as SqliteDb } from 'better-sqlite3';
import { StatementFactory } from './statement';
import { SongDb } from './song';
import { Logger } from '../app/logger';

const STATEMENTS = {
  INSERT_ANIME: 'INSERT_ANIME',
  DELETE_ANIME: 'DELETE_ANIME',
  SELECT_ANIME_BY_ID: 'SELECT_ANIME_BY_ID',
  DELETE_SONG_ANIME_BY_ANIME_ID: 'DELETE_SONG_ANIME_BY_ANIME_ID',
  SELECT_ALL_ANIME_GROUP_BY_ID: 'SELECT_ALL_ANIME_GROUP_BY_ID',
  SELECT_ALL_ANIME_NAME: 'SELECT_ALL_ANIME_NAME'
};

const RAW_STATEMENTS = {
  [STATEMENTS.INSERT_ANIME]: `
    INSERT INTO animes
      (anime_id, anime_name)
    VALUES
      (?,?)
  `,
  [STATEMENTS.DELETE_ANIME]: `
    DELETE FROM animes
    WHERE anime_id = @animeId
  `,
  [STATEMENTS.SELECT_ANIME_BY_ID]: `
    SELECT
      *
    FROM animes
    WHERE anime_id = @animeId
  `,
  [STATEMENTS.DELETE_SONG_ANIME_BY_ANIME_ID]: `
    DELETE FROM song_animes WHERE anime_id = @animeId
  `,
  [STATEMENTS.SELECT_ALL_ANIME_GROUP_BY_ID]: `
    SELECT
      anime_id,
      json_group_array(anime_name) as anime_name
    FROM animes
    GROUP BY anime_id
  `,
  [STATEMENTS.SELECT_ALL_ANIME_NAME]: `
    SELECT
      anime_name
    FROM animes
  `
};

class AnimeDb extends ServerDb<AnimeType> {
  protected _db: SqliteDb;
  protected _songDb: SongDb;
  protected _factory: StatementFactory;
  protected _animeList: AnimeType[] = [];
  protected _animeNames: AnimeNameType[] = [];

  constructor(config: ServerConfig, logger: Logger, songDb: SongDb) {
    super(config, logger);
    this._songDb = songDb;
    this._db = mainDbConnection(null, config);
    this._factory = new StatementFactory(this._db, RAW_STATEMENTS);
    this.reloadCache();
  }

  public get animeList(): AnimeType[] {
    return this._animeList;
  }

  public get animeNames(): AnimeNameType[] {
    return this._animeNames;
  }

  public newRecord(record: AnimeType) {
    const statement = this._factory.getStatement(STATEMENTS.INSERT_ANIME);
    const insertMany = this._db.transaction(() => {
      for (const animeName of record.animeName) {
        statement.run(record.animeId, animeName);
      }
    });
    insertMany();
    this.reloadCache();
  }

  public editRecord(record: AnimeType) {
    const statement = this._factory.getStatement(STATEMENTS.DELETE_ANIME);
    statement.run(record);
    this.newRecord(record);
    this.reloadCache();
    this._songDb.reloadCache();
  }

  public deleteRecord(record: AnimeType) {
    const deleteAnimeStatement = this._factory.getStatement(STATEMENTS.DELETE_ANIME);
    deleteAnimeStatement.run(record);
    const deleteSongAnimeStatement = this._factory.getStatement(STATEMENTS.DELETE_SONG_ANIME_BY_ANIME_ID);
    deleteSongAnimeStatement.run(record);
    this.reloadCache();
    this._songDb.reloadCache();
  }

  public validateRecordNotExists(record: AnimeType) {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_ANIME_BY_ID);
    const response = statement.get(record);
    if (response) {
      throw new DataQualityError('Anime already exist');
    }
  }

  public validateRecordExists(record: AnimeType) {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_ANIME_BY_ID);
    const response = statement.get(record);
    if (!response) {
      throw new DataQualityError('Anime does not exist');
    }
  }

  public validateAnimesExists(animeIds: AnimeIdType[]) {
    const statement = this._db.prepare(`
      SELECT
        anime_id
      FROM animes
      WHERE anime_id IN (${this._questionString(animeIds.length)})
    `);
    const response = statement.all(animeIds);
    if (response.length !== animeIds.length) {
      throw new DataQualityError('Anime does not exist');
    }
  }

  protected _getAnimeList(): AnimeType[] {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_ALL_ANIME_GROUP_BY_ID);
    const response = statement.all();
    return response
      .map((item) => DbAnime.parse(item))
      .map((dbAnime) => {
        const anime: AnimeType = {
          animeId: dbAnime.anime_id,
          animeName: dbAnime.anime_name
        };
        return Anime.parse(anime);
      });
  }

  protected _getAnimeNames(): AnimeNameType[] {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_ALL_ANIME_NAME);
    const response = statement.all();
    return Array.from(new Set(response.map((item) => DbAnimeName.parse(item).anime_name)));
  }

  public reloadDb() {
    this._db = mainDbConnection(this._db, this._config);
    this._factory = new StatementFactory(this._db, RAW_STATEMENTS);
    this.reloadCache();
  }

  public reloadCache() {
    this._animeList = this._getAnimeList();
    this._animeNames = this._getAnimeNames();
  }
}

export { AnimeDb };
