import { AbstractDb } from './common';
import { ServerConfig } from '../interfaces';
import { Logger } from '../app/logging/logger';
import { DbSong } from '../models/song';
import { DbAnimeType, DbSongType } from '../models/types';
import { AnimeNameType, AnimeType, SongTitleType, SongType } from '../shared/models/types';
import { Anime, AnimeName } from '../shared/models/anime';
import { DbAnime } from '../models/anime';
import { Song, SongTitle } from '../shared/models/song';

class SongDb extends AbstractDb {
  protected _songList: SongType[] = [];
  protected _songTitles: SongTitleType[] = [];
  protected _animeList: AnimeType[] = [];
  protected _animeNames: AnimeNameType[] = [];

  constructor(config: ServerConfig, logger: Logger) {
    super(logger, config.mainDbPath);
    this.reloadCache();
  }

  public get songList(): SongType[] {
    return this._songList;
  }

  public get animeNames(): AnimeNameType[] {
    return this._animeNames;
  }

  public get songTitles(): SongTitleType[] {
    return this._songTitles;
  }

  public get animeList(): AnimeType[] {
    return this._animeList;
  }

  public reloadCache(): void {
    this._songList = this._getSongList();
    this._animeList = this._getAnimeList();
    this._songTitles = this._getSongTitles();
    this._animeNames = this._getAnimeNames();
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
      .map((anime) => Anime.parse(this._dbAnimeToAnime(anime)));
  }

  protected _getSongList(): SongType[] {
    const statement = this._db.prepare(`
      SELECT
        songs.song_id,
        src,
        song_title,
        type,
        artist,
        json_group_array(song_animes.anime_id) as anime_id,
        json_group_array(anime_name) as anime_name
      FROM animes
        INNER JOIN song_animes ON animes.anime_id = song_animes.anime_id
        INNER JOIN songs ON songs.song_id = song_animes.song_id
      GROUP BY songs.song_id
    `);
    const response = statement.all();
    return response
      .map((item) => DbSong.parse(item))
      .map((song) => Song.parse(this._dbSongToSong(song)));
  }

  protected _getSongTitles(): SongTitleType[] {
    return Array.from(new Set(this._songList.map((song) => SongTitle.parse(song.songTitle))));
  }

  protected _getAnimeNames(): AnimeNameType[] {
    let animeNames: AnimeNameType[] = [];
    for (const anime of this._animeList) {
      animeNames = animeNames.concat(anime.animeName);
    }

    return Array.from(new Set(animeNames.map((name) => AnimeName.parse(name))));
  }

  protected _dbSongToSong(dbSong: DbSongType): SongType {
    return {
      songId: dbSong.song_id,
      songTitle: dbSong.song_title,
      src: dbSong.src,
      artist: dbSong.artist,
      type: dbSong.type,
      animeId: dbSong.anime_id,
      animeName: dbSong.anime_name
    };
  }

  protected _dbAnimeToAnime(dbAnime: DbAnimeType): AnimeType {
    return {
      animeId: dbAnime.anime_id,
      animeName: dbAnime.anime_name
    };
  }
}

export { SongDb };
