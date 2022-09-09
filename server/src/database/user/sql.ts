import { Database } from 'better-sqlite3';
import { AbstractSqlStatement, questionString } from '../abstract';

class UserDbStatements {
  protected _insertUser: InsertUser;
  protected _updateUserById: UpdateUserById;
  protected _deleteUserById: DeleteUserById;
  protected _deleteUserSongByUserId: DeleteUserSongByUserId;
  protected _getAllUser: GetAllUser;
  protected _deleteUserSongByUserIdAndSongId: DeleteUserSongByUserIdAndSongId;
  protected _deleteUserSongBySongId: DeleteUserSongBySongId;
  protected _getUserById: GetUserById;
  protected _getUserByUsername: GetUserByUsername;
  protected _insertUserSong: InsertUserSong;

  constructor(db: Database) {
    this._insertUser = new InsertUser(db);
    this._updateUserById = new UpdateUserById(db);
    this._deleteUserById = new DeleteUserById(db);
    this._deleteUserSongByUserId = new DeleteUserSongByUserId(db);
    this._getAllUser = new GetAllUser(db);
    this._deleteUserSongByUserIdAndSongId = new DeleteUserSongByUserIdAndSongId(db);
    this._deleteUserSongBySongId = new DeleteUserSongBySongId(db);
    this._getUserById = new GetUserById(db);
    this._getUserByUsername = new GetUserByUsername(db);
    this._insertUserSong = new InsertUserSong(db);
  }

  get updateUserById(): UpdateUserById {
    return this._updateUserById;
  }

  get insertUser(): InsertUser {
    return this._insertUser;
  }

  get deleteUserById(): DeleteUserById {
    return this._deleteUserById;
  }

  get deleteUserSongByUserId(): DeleteUserSongByUserId {
    return this._deleteUserSongByUserId;
  }

  get getAllUser(): GetAllUser {
    return this._getAllUser;
  }

  get deleteUserSongByUserIdAndSongId(): DeleteUserSongByUserIdAndSongId {
    return this._deleteUserSongByUserIdAndSongId;
  }

  get deleteUserSongBySongId(): DeleteUserSongBySongId {
    return this._deleteUserSongBySongId;
  }

  get getUserById(): GetUserById {
    return this._getUserById;
  }

  get getUserByUsername(): GetUserByUsername {
    return this._getUserByUsername;
  }

  get insertUserSong(): InsertUserSong {
    return this._insertUserSong;
  }
}

class GetListUserSongByUserIdAndSongIds extends AbstractSqlStatement {
  constructor(db: Database, listLength: number) {
    const sql = `
      SELECT 
        song_id
      FROM user_songs 
      WHERE user_id = ? AND 
            song_id IN (${questionString(listLength)})
    `;
    super(db, sql);
  }
}

class InsertUserSong extends AbstractSqlStatement {
  constructor(db: Database) {
    super(db, `INSERT INTO user_songs (user_id, song_id) VALUES (?,?)`);
  }
}

class GetUserByUsername extends AbstractSqlStatement {
  constructor(db: Database) {
    const sql = `
      SELECT
        *
      FROM users
      WHERE username = ?
    `;
    super(db, sql);
  }
}

class GetUserById extends AbstractSqlStatement {
  constructor(db: Database) {
    const sql = `
      SELECT
        *
      FROM users
      WHERE user_id = ?
    `;
    super(db, sql);
  }
}

class DeleteUserSongBySongId extends AbstractSqlStatement {
  constructor(db: Database) {
    super(db, `DELETE FROM user_songs WHERE song_id = ?`);
  }
}

class DeleteUserSongByUserIdAndSongId extends AbstractSqlStatement {
  constructor(db: Database) {
    super(db, `DELETE FROM user_songs WHERE user_id = ? AND song_id = ?`);
  }
}

class GetAllUser extends AbstractSqlStatement {
  constructor(db: Database) {
    const sql = `
      SELECT 
        users.user_id,
        username,
        json_group_array(song_id) as song_id 
      FROM users
        LEFT JOIN user_songs
        ON users.user_id = user_songs.user_id
      GROUP BY users.user_id
    `;
    super(db, sql);
  }
}

class DeleteUserSongByUserId extends AbstractSqlStatement {
  constructor(db: Database) {
    super(db, `DELETE FROM user_songs WHERE user_id = ?`);
  }
}

class DeleteUserById extends AbstractSqlStatement {
  constructor(db: Database) {
    super(db, `DELETE FROM users WHERE user_id = ?`);
  }
}

class UpdateUserById extends AbstractSqlStatement {
  constructor(db: Database) {
    const sql = `
      UPDATE users
      SET 
        username = ?
      WHERE user_id = ?
    `;
    super(db, sql);
  }
}

class InsertUser extends AbstractSqlStatement {
  constructor(db: Database) {
    super(db, `INSERT INTO users (user_id, username) VALUES (?,?)`);
  }
}

export { UserDbStatements, GetListUserSongByUserIdAndSongIds };
