import { Database } from 'better-sqlite3';
import { AbstractSqlStatement, questionString } from '../abstract';

class SongDbStatements {
  protected _getAllSong: GetAllSong;
  protected _deleteAnimeByAnimeId: DeleteAnimeByAnimeId;
  protected _deleteSongBySongId: DeleteSongBySongId;
  protected _insertAnime: InsertAnime;
  protected _updateSongById: UpdateSongById;
  protected _deleteSongAnimeBySongId: DeleteSongAnimeBySongId;
  protected _insertSong: InsertSong;
  protected _insertSongAnime: InsertSongAnime;
  protected _getAllSongTitle: GetAllSongTitle;
  protected _getAllAnime: GetAllAnime;

  constructor(db: Database) {
    this._getAllSong = new GetAllSong(db);
    this._deleteAnimeByAnimeId = new DeleteAnimeByAnimeId(db);
    this._deleteSongBySongId = new DeleteSongBySongId(db);
    this._insertAnime = new InsertAnime(db);
    this._updateSongById = new UpdateSongById(db);
    this._deleteSongAnimeBySongId = new DeleteSongAnimeBySongId(db);
    this._insertSong = new InsertSong(db);
    this._insertSongAnime = new InsertSongAnime(db);
    this._getAllSongTitle = new GetAllSongTitle(db);
    this._getAllAnime = new GetAllAnime(db);
  }

  get getAllSong(): GetAllSong {
    return this._getAllSong;
  }

  get deleteAnimeByAnimeId(): DeleteAnimeByAnimeId {
    return this._deleteAnimeByAnimeId;
  }

  get deleteSongBySongId(): DeleteSongBySongId {
    return this._deleteSongBySongId;
  }

  get insertAnime(): InsertAnime {
    return this._insertAnime;
  }

  get updateSongById(): UpdateSongById {
    return this._updateSongById;
  }

  get deleteSongAnimeBySongId(): DeleteSongAnimeBySongId {
    return this._deleteSongAnimeBySongId;
  }

  get insertSong(): InsertSong {
    return this._insertSong;
  }

  get insertSongAnime(): InsertSongAnime {
    return this._insertSongAnime;
  }

  get getAllSongTitle(): GetAllSongTitle {
    return this._getAllSongTitle;
  }

  get getAllAnime(): GetAllAnime {
    return this._getAllAnime;
  }
}

class GetAllSong extends AbstractSqlStatement {
  constructor(db: Database) {
    const sql = `
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
    `;
    super(db, sql);
  }
}

class DeleteAnimeByAnimeId extends AbstractSqlStatement {
  constructor(db: Database) {
    super(db, `DELETE FROM animes WHERE anime_id = ?`);
  }
}

class DeleteSongBySongId extends AbstractSqlStatement {
  constructor(db: Database) {
    super(db, `DELETE FROM songs WHERE song_id = ?`);
  }
}

class InsertAnime extends AbstractSqlStatement {
  constructor(db: Database) {
    super(db, `INSERT INTO animes (anime_id, anime_name) VALUES (?,?)`);
  }
}

class UpdateSongById extends AbstractSqlStatement {
  constructor(db: Database) {
    const sql = `
      UPDATE songs
      SET 
        song_title = ?,
        src = ?,
        artist = ?,
        type = ?
      WHERE song_id = ?
    `;
    super(db, sql);
  }
}

class DeleteSongAnimeBySongId extends AbstractSqlStatement {
  constructor(db: Database) {
    super(db, `DELETE FROM song_animes WHERE song_id = ?`);
  }
}

class InsertSong extends AbstractSqlStatement {
  constructor(db: Database) {
    const sql = `
      INSERT INTO songs 
        (song_id, song_title, src, artist, type) 
      VALUES 
        (?,?,?,?,?)
    `;
    super(db, sql);
  }
}

class InsertSongAnime extends AbstractSqlStatement {
  constructor(db: Database) {
    super(db, `INSERT INTO song_animes (song_id, anime_id) VALUES (?,?)`);
  }
}

class GetAllSongTitle extends AbstractSqlStatement {
  constructor(db: Database) {
    const sql = `
      SELECT DISTINCT
        song_title
      FROM songs
    `;
    super(db, sql);
  }
}

class GetAllAnime extends AbstractSqlStatement {
  constructor(db: Database) {
    const sql = `
      SELECT
        anime_id,
        json_group_array(anime_name) as anime_name
      FROM animes
      GROUP BY anime_id
    `;
    super(db, sql);
  }
}

class GetListAnimeByAnimeIds extends AbstractSqlStatement {
  constructor(db: Database, listLength: number) {
    const sql = `
      SELECT
        anime_id
      FROM animes
      WHERE animes.anime_id IN (${questionString(listLength)})
    `;
    super(db, sql);
  }
}

class GetListSongBySongIds extends AbstractSqlStatement {
  constructor(db: Database, listLength: number) {
    const sql = `
      SELECT
        song_id
      FROM songs
      WHERE song_id IN (${questionString(listLength)})
    `;
    super(db, sql);
  }
}

export { SongDbStatements, GetListAnimeByAnimeIds, GetListSongBySongIds };
