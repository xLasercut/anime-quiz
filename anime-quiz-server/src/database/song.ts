import { AbstractDb } from './common';
import { ServerConfig } from '../interfaces';
import { Logger } from '../app/logging/logger';
import { DbSong } from '../models/song';
import { SongTitleType, SongType } from '../shared/models/types';
import { Song, SongTitle } from '../shared/models/song';

class SongDb extends AbstractDb {
  protected _songList: SongType[] = [];
  protected _songTitles: SongTitleType[] = [];

  constructor(config: ServerConfig, logger: Logger) {
    super(config.mainDbPath, logger);
    this.reloadCache();
  }

  public get songList(): SongType[] {
    return this._songList;
  }

  public get songTitles(): SongTitleType[] {
    return this._songTitles;
  }

  public reloadCache(): void {
    this._songList = this._getSongList();
    this._songTitles = this._getSongTitles();
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
    return Array.from(new Set(this._songList.map((song) => SongTitle.parse(song.songTitle))));
  }
}

export { SongDb };
