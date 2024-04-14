import { DatabaseDataState, mainDbConnection, ServerDb } from './common';
import { TServerConfig } from '../interfaces';
import { Anime, TAnime, TAnimeId, TAnimeName } from 'anime-quiz-shared-resources';
import { DbAnime, DbAnimeName } from '../models/anime';
import { DataQualityError } from '../app/exceptions';
import { Database as SqliteDb } from 'better-sqlite3';
import { StatementFactory } from './statement';
import { SongDb } from './song';
import { Logger } from 'winston';

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

class AnimeDb extends ServerDb<TAnime> {
  protected _db: SqliteDb;
  protected _songDb: SongDb;
  protected _factory: StatementFactory;
  protected _animeList: TAnime[] = [];
  protected _animeNames: TAnimeName[] = [];

  constructor(config: TServerConfig, logger: Logger, songDb: SongDb, state: DatabaseDataState) {
    super(config, logger, state);
    this._songDb = songDb;
    this._db = mainDbConnection(null, config);
    this._factory = new StatementFactory(this._db, RAW_STATEMENTS);
    this.reloadCache();
  }

  public get animeList(): TAnime[] {
    return this._animeList;
  }

  public get animeNames(): TAnimeName[] {
    return this._animeNames;
  }

  public newRecord(record: TAnime) {
    const statement = this._factory.getStatement(STATEMENTS.INSERT_ANIME);
    const insertMany = this._db.transaction(() => {
      for (const animeName of record.animeName) {
        statement.run(record.animeId, animeName);
      }
    });
    insertMany();
    this.reloadCache();
  }

  public editRecord(record: TAnime) {
    const statement = this._factory.getStatement(STATEMENTS.DELETE_ANIME);
    statement.run(record);
    this.newRecord(record);
    this.reloadCache();
    this._songDb.reloadCache();
  }

  public deleteRecord(record: TAnime) {
    const deleteAnimeStatement = this._factory.getStatement(STATEMENTS.DELETE_ANIME);
    deleteAnimeStatement.run(record);
    const deleteSongAnimeStatement = this._factory.getStatement(STATEMENTS.DELETE_SONG_ANIME_BY_ANIME_ID);
    deleteSongAnimeStatement.run(record);
    this.reloadCache();
    this._songDb.reloadCache();
  }

  public validateRecordNotExists(record: TAnime) {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_ANIME_BY_ID);
    const response = statement.get(record);
    if (response) {
      throw new DataQualityError('Anime already exist');
    }
  }

  public validateRecordExists(record: TAnime) {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_ANIME_BY_ID);
    const response = statement.get(record);
    if (!response) {
      throw new DataQualityError('Anime does not exist');
    }
  }

  public validateAnimesExists(animeIds: TAnimeId[]) {
    const statement = this._db.prepare(`
      SELECT DISTINCT
        anime_id
      FROM animes
      WHERE anime_id IN (${this._questionString(animeIds.length)})
    `);
    const response = statement.all(animeIds);
    if (response.length !== animeIds.length) {
      throw new DataQualityError('Anime does not exist');
    }
  }

  protected _getAnimeList(): TAnime[] {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_ALL_ANIME_GROUP_BY_ID);
    const response = statement.all();
    return response
      .map((item) => DbAnime.parse(item))
      .map((dbAnime) => {
        const anime: TAnime = {
          animeId: dbAnime.anime_id,
          animeName: dbAnime.anime_name
        };
        return Anime.parse(anime);
      });
  }

  protected _getAnimeNames(): TAnimeName[] {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_ALL_ANIME_NAME);
    const response = statement.all();
    const existingAnimeNames: Set<TAnimeName> = new Set();
    const animeNames: TAnimeName[] = [];
    for (const item of response) {
      const parsedName = DbAnimeName.parse(item).anime_name;
      if (existingAnimeNames.has(parsedName.toLowerCase())) {
        continue;
      }
      existingAnimeNames.add(parsedName.toLowerCase());
      animeNames.push(parsedName);
    }
    return animeNames;
  }

  public reloadDb() {
    this._db = mainDbConnection(this._db, this._config);
    this._factory = new StatementFactory(this._db, RAW_STATEMENTS);
    this.reloadCache();
  }

  public reloadCache() {
    this._animeList = this._getAnimeList();
    this._animeNames = this._getAnimeNames();
    this._state.updateState();
  }
}

export { AnimeDb };
