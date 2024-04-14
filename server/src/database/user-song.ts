import { DatabaseDataState, ServerDb, userDbConnection } from './common';
import { TDbUserSong } from '../models/types';
import { TServerConfig } from '../interfaces';
import { Database as SqliteDb } from 'better-sqlite3';
import { StatementFactory } from './statement';
import { DataQualityError } from '../app/exceptions';
import { TSongId, TUserId } from 'anime-quiz-shared-resources';
import { DbUserSongList } from '../models/user';
import { Logger } from 'winston';

const STATEMENTS = {
  INSERT_USER_SONGS: 'INSERT_USER_SONGS',
  SELECT_USER_SONGS_BY_USER_ID: 'SELECT_USER_SONGS_BY_USER_ID',
  DELETE_USER_SONGS_BY_USER_ID_AND_SONG_ID: 'DELETE_USER_SONGS_BY_USER_ID_AND_SONG_ID'
};

const RAW_STATEMENTS = {
  [STATEMENTS.INSERT_USER_SONGS]: `
    INSERT INTO user_songs 
      (user_id, song_id) 
    VALUES (?, ?)
  `,
  [STATEMENTS.SELECT_USER_SONGS_BY_USER_ID]: `
    SELECT
      discord_id,
      users.user_id,
      display_name,
      avatar,
      admin,
      json_group_array(song_id) AS song_id
    FROM users
    LEFT JOIN user_songs
        ON users.user_id = user_songs.user_id
    WHERE users.user_id = ?
    GROUP BY users.user_id
  `,
  [STATEMENTS.DELETE_USER_SONGS_BY_USER_ID_AND_SONG_ID]: `
    DELETE FROM user_songs 
    WHERE user_id = ? AND song_id = ?
  `
};

class UserSongDb extends ServerDb<TDbUserSong> {
  protected _db: SqliteDb;
  protected _factory: StatementFactory;

  constructor(config: TServerConfig, logger: Logger, state: DatabaseDataState) {
    super(config, logger, state);
    this._db = userDbConnection(null, config);
    this._factory = new StatementFactory(this._db, RAW_STATEMENTS);
  }

  public newRecord(record: TDbUserSong) {
    const statement = this._factory.getStatement(STATEMENTS.INSERT_USER_SONGS);
    const insertMany = this._db.transaction(() => {
      for (const songId of record.song_id) {
        statement.run(record.user_id, songId);
      }
    });
    insertMany();
  }

  public editRecord(record: TDbUserSong) {}

  public deleteRecord(record: TDbUserSong) {
    const statement = this._factory.getStatement(STATEMENTS.DELETE_USER_SONGS_BY_USER_ID_AND_SONG_ID);
    const deleteMany = this._db.transaction(() => {
      for (const songId of record.song_id) {
        statement.run(record.user_id, songId);
      }
    });
    deleteMany();
  }

  public validateRecordExists(record: TDbUserSong) {
    if (record.song_id.length > 50) {
      throw new DataQualityError('Cannot remove more than 50 songs at a time');
    }
  }

  public validateRecordNotExists(record: TDbUserSong) {
    if (record.song_id.length > 50) {
      throw new DataQualityError('Cannot add more than 50 songs at a time');
    }

    const statement = this._db.prepare(`
      SELECT
        user_id,
        song_id
      FROM user_songs
      WHERE user_id = ? AND
            song_id IN (${this._questionString(record.song_id.length)})
    `);
    const response = statement.all(record.user_id, record.song_id);
    if (response.length > 0) {
      throw new DataQualityError('Songs already exists in list');
    }
  }

  public getUserSongList(userId: TUserId): TSongId[] {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_USER_SONGS_BY_USER_ID);
    const response = statement.get(userId);
    this._logger.debug('fetched user song list', {
      response: response,
      userId: userId
    });
    if (!response) {
      return [];
    }
    const dbUserSongList = DbUserSongList.parse(response);
    return dbUserSongList.song_id;
  }

  public reloadDb() {
    this._db = userDbConnection(this._db, this._config);
    this._factory = new StatementFactory(this._db, RAW_STATEMENTS);
    this.reloadCache();
  }

  public reloadCache() {}
}

export { UserSongDb };
