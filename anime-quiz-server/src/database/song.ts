import { AbstractDb } from './common';
import { ServerConfig } from '../interfaces';
import { Logger } from '../app/logging/logger';
import { DbSong, DbSongTitle } from '../models/song';
import { AnimeIdType, SongIdType, SongTitleType, SongType } from '../shared/models/types';
import { Song, SongTitle } from '../shared/models/song';
import { DbSongTitleType } from '../models/types';
import { DataQualityError } from '../app/exceptions';

class SongDb extends AbstractDb {
  constructor(config: ServerConfig, logger: Logger) {
    super(config.mainDbPath, logger);
  }

  public newSong(song: SongType) {
    const statement = this._db.prepare(`
      INSERT INTO songs 
        (song_id, song_title, src, artist, type)
      VALUES
        (@songId, @songTitle, @src, @artist, @type)
    `);
    statement.run(song);
    this.newSongAnime(song);
  }

  public editSong(song: SongType) {
    const statement = this._db.prepare(`
      UPDATE songs
      SET
        song_title = @songTitle,
        src = @src,
        artist = @artist,
        type = @type
      WHERE song_id = @songId
    `);
    statement.run(song);
    this.deleteSongAnimeBySongId(song.songId);
    this.newSongAnime(song);
  }

  public deleteSong(song: SongType) {
    const statement = this._db.prepare(`
      DELETE FROM songs WHERE song_id = @songId
    `);
    statement.run(song);
    this.deleteSongAnimeBySongId(song.songId);
  }

  public deleteSongAnimeByAnimeId(animeId: AnimeIdType) {
    const statement = this._db.prepare(`
      DELETE FROM song_animes WHERE anime_id = ?
    `);
    statement.run(animeId);
  }

  public deleteSongAnimeBySongId(songId: SongIdType) {
    const statement = this._db.prepare(`
      DELETE FROM song_animes WHERE song_id = ?
    `);
    statement.run(songId);
  }

  public newSongAnime(song: SongType) {
    const statement = this._db.prepare(`
      INSERT INTO song_animes
        (song_id, anime_id)
      VALUES
        (?,?)
    `);
    const insertMany = this._db.transaction(() => {
      for (const animeId of song.animeId) {
        statement.run(song.songId, animeId);
      }
    });
    insertMany();
  }

  public validateSongExists(song: SongType) {
    const statement = this._db.prepare(`
      SELECT
        song_id
      FROM songs
      WHERE song_id = @songId
    `);
    const response = statement.get(song);
    if (!response) {
      throw new DataQualityError('Song does not exists');
    }
  }

  public validateSongNotExists(song: SongType) {
    const statement = this._db.prepare(`
      SELECT
        song_id
      FROM songs
      WHERE song_id = @songId
    `);
    const response = statement.get(song);
    if (response) {
      throw new DataQualityError('Song already exists');
    }
  }

  public getSongList(): SongType[] {
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

  public getSongTitles(): SongTitleType[] {
    const statement = this._db.prepare(`
      SELECT
        song_title
      FROM songs
    `);
    const response = statement.all();
    return Array.from(new Set(response.map((item) => DbSongTitle.parse(item).song_title)));
  }
}

export { SongDb };
