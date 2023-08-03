import { AbstractDb } from './common';
import { ServerConfig } from '../interfaces';
import { Logger } from '../app/logging/logger';
import { AnimeNameType, AnimeType } from '../shared/models/types';
import { DbAnime } from '../models/anime';
import { Anime, AnimeName } from '../shared/models/anime';

class AnimeDb extends AbstractDb {
  protected _animeList: AnimeType[] = [];
  protected _animeNames: AnimeNameType[] = [];

  constructor(config: ServerConfig, logger: Logger) {
    super(config.mainDbPath, logger);
    this.reloadCache();
  }

  public reloadCache() {
    this._animeList = this._getAnimeList();
    this._animeNames = this._getAnimeNames();
  }

  public get animeList(): AnimeType[] {
    return this._animeList;
  }

  public get animeNames(): AnimeNameType[] {
    return this._animeNames;
  }

  protected _getAnimeList(): AnimeType[] {
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

  protected _getAnimeNames(): AnimeNameType[] {
    let animeNames: AnimeNameType[] = [];
    for (const anime of this._animeList) {
      animeNames = animeNames.concat(anime.animeName);
    }

    return Array.from(new Set(animeNames.map((name) => AnimeName.parse(name))));
  }
}

export { AnimeDb };
