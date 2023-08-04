import { AbstractDb } from './common';
import { ServerConfig } from '../interfaces';
import { Logger } from '../app/logging/logger';
import { AnimeIdType, AnimeNameType, AnimeType } from '../shared/models/types';
import { DbAnime, DbAnimeName } from '../models/anime';
import { Anime, AnimeName } from '../shared/models/anime';
import { DataQualityError } from '../app/exceptions';

class AnimeDb extends AbstractDb {
  constructor(config: ServerConfig, logger: Logger) {
    super(config.mainDbPath, logger);
  }

  public newAnime(anime: AnimeType) {
    const statement = this._db.prepare(`
        INSERT INTO animes (anime_id, anime_name) VALUES (?,?)
    `);
    const insertMany = this._db.transaction(() => {
      for (const animeName of anime.animeName) {
        statement.run(anime.animeId, animeName);
      }
    });
    insertMany();
  }

  public editAnime(anime: AnimeType) {
    this.deleteAnime(anime);
    this.newAnime(anime);
  }

  public deleteAnime(anime: AnimeType) {
    const statement = this._db.prepare(`
      DELETE FROM animes where anime_id = @animeId
    `);
    statement.run(anime);
  }

  public validateAnimeNotExists(anime: AnimeType) {
    const statement = this._db.prepare(`
      SELECT
        anime_id
      FROM animes
      WHERE anime_id = @animeId
    `);
    const response = statement.get(anime);
    if (response) {
      throw new DataQualityError('Anime already exists');
    }
  }

  public validateAnimeExists(anime: AnimeType) {
    const statement = this._db.prepare(`
      SELECT
        anime_id
      FROM animes
      WHERE anime_id = @animeId
    `);
    const response = statement.get(anime);
    if (!response) {
      throw new DataQualityError('Anime does not exists');
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

  public getAnimeList(): AnimeType[] {
    const statement = this._db.prepare(`
      SELECT
        anime_id,
        json_group_array(anime_name) as anime_name
      FROM animes
      GROUP BY anime_id
    `);
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

  public getAnimeNames(): AnimeNameType[] {
    const statement = this._db.prepare(`
      SELECT
        anime_name
      FROM animes
    `);
    const response = statement.all();
    return Array.from(new Set(response.map((item) => DbAnimeName.parse(item).anime_name)));
  }
}

export { AnimeDb };
