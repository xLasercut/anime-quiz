import { Database } from 'better-sqlite3';
import { AbstractSqlStatement, createSqlStatement } from '../abstract';

class EmojiDbStatements {
  protected _deleteEmojiById: DeleteEmojiById;
  protected _insertEmoji: InsertEmoji;
  protected _updateEmojiById: UpdateEmojiById;
  protected _getEmojiById: GetEmojiById;
  protected _getEmojiByCommand: GetEmojiByCommand;
  protected _getAllEmoji: GetAllEmoji;

  constructor(db: Database) {
    this._deleteEmojiById = new DeleteEmojiById(db);
    this._insertEmoji = new InsertEmoji(db);
    this._updateEmojiById = new UpdateEmojiById(db);
    this._getEmojiById = new GetEmojiById(db);
    this._getEmojiByCommand = new GetEmojiByCommand(db);
    this._getAllEmoji = new GetAllEmoji(db);
  }

  get deleteEmojiById(): DeleteEmojiById {
    return this._deleteEmojiById;
  }

  get insertEmoji(): InsertEmoji {
    return this._insertEmoji;
  }

  get updateEmojiById(): UpdateEmojiById {
    return this._updateEmojiById;
  }

  get getEmojiById(): GetEmojiById {
    return this._getEmojiById;
  }

  get getEmojiByCommand(): GetEmojiByCommand {
    return this._getEmojiByCommand;
  }

  get getAllEmoji(): GetAllEmoji {
    return this._getAllEmoji;
  }
}

class DeleteEmojiById extends AbstractSqlStatement {
  constructor(db: Database) {
    super(db, `DELETE FROM emojis WHERE emoji_id = ?`);
  }
}

class InsertEmoji extends AbstractSqlStatement {
  constructor(db: Database) {
    super(db, `INSERT INTO emojis (emoji_id, command, src, type) VALUES (?,?,?,?)`);
  }
}

class UpdateEmojiById extends AbstractSqlStatement {
  constructor(db: Database) {
    const sql = `
      UPDATE emojis
      SET 
        command = ?,
        src = ?,
        type = ?
      WHERE emoji_id = ?
    `;
    super(db, sql);
  }
}

class GetEmojiById extends AbstractSqlStatement {
  constructor(db: Database) {
    const sql = `
      SELECT
        *
      FROM emojis
      WHERE emojis.emoji_id = ?
    `;
    super(db, sql);
  }
}

class GetEmojiByCommand extends AbstractSqlStatement {
  constructor(db: Database) {
    const sql = `
      SELECT
        *
      FROM emojis
      WHERE emojis.command = ?
    `;
    super(db, sql);
  }
}

class GetAllEmoji extends AbstractSqlStatement {
  constructor(db: Database) {
    const sql = `
      SELECT
        *
      FROM emojis
    `;
    super(db, sql);
  }
}

export { EmojiDbStatements };
