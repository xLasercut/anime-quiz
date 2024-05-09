import { DatabaseDataState, mainDbConnection, ServerDb } from './common';
import { Emoji, TEmoji } from 'anime-quiz-shared-resources';
import { DbEmoji } from '../models/emoji';
import { Database as SqliteDb } from 'better-sqlite3';
import { StatementFactory } from './statement';
import { DataQualityError } from '../app/exceptions';
import { Logger } from 'winston';
import { TServerConfig } from '../models/types';

const STATEMENTS = {
  SELECT_ALL_EMOJI: 'SELECT_ALL_EMOJI',
  INSERT_EMOJI: 'INSERT_EMOJI',
  EDIT_EMOJI: 'EDIT_EMOJI',
  DELETE_EMOJI: 'DELETE_EMOJI',
  SELECT_EMOJI_BY_ID: 'SELECT_EMOJI_BY_ID',
  SELECT_EMOJI_BY_ID_OR_COMMAND: 'SELECT_EMOJI_BY_ID_OR_COMMAND',
  SELECT_EMOJI_BY_COMMAND: 'SELECT_EMOJI_BY_COMMAND'
};

const RAW_STATEMENTS = {
  [STATEMENTS.SELECT_ALL_EMOJI]: `
    SELECT
      * 
    FROM emojis
  `,
  [STATEMENTS.INSERT_EMOJI]: `
    INSERT INTO emojis 
      (emoji_id, command, src, type) 
    VALUES 
      (@emojiId, @command, @src, @type)
  `,
  [STATEMENTS.EDIT_EMOJI]: `
    UPDATE emojis 
    SET 
      command = @command, 
      src = @src, 
      type = @type 
    WHERE emoji_id = @emojiId
  `,
  [STATEMENTS.DELETE_EMOJI]: `
    DELETE FROM emojis
    WHERE emoji_id = @emojiId
  `,
  [STATEMENTS.SELECT_EMOJI_BY_ID]: `
    SELECT
      *
    FROM emojis
    WHERE emoji_id = @emojiId
  `,
  [STATEMENTS.SELECT_EMOJI_BY_ID_OR_COMMAND]: `
    SELECT
      *
    FROM emojis
    WHERE emoji_id = @emojiId OR command = @command
  `,
  [STATEMENTS.SELECT_EMOJI_BY_COMMAND]: `
    SELECT
      *
    FROM emojis
    WHERE command = @command AND emoji_id != @emojiId
  `
};

class EmojiDb extends ServerDb<TEmoji> {
  protected _db: SqliteDb;
  protected _factory: StatementFactory;
  protected _emojiList: TEmoji[] = [];

  constructor(config: TServerConfig, logger: Logger, state: DatabaseDataState) {
    super(config, logger, state);
    this._db = mainDbConnection(null, config);
    this._factory = new StatementFactory(this._db, RAW_STATEMENTS);
    this.reloadCache();
  }

  public get emojiList(): TEmoji[] {
    return this._emojiList;
  }

  public newRecord(record: TEmoji) {
    const statement = this._factory.getStatement(STATEMENTS.INSERT_EMOJI);
    statement.run(record);
    this.reloadCache();
  }

  public editRecord(record: TEmoji) {
    const statement = this._factory.getStatement(STATEMENTS.EDIT_EMOJI);
    statement.run(record);
    this.reloadCache();
  }

  public deleteRecord(record: TEmoji) {
    const statement = this._factory.getStatement(STATEMENTS.DELETE_EMOJI);
    statement.run(record);
    this.reloadCache();
  }

  public reloadDb() {
    this._db = mainDbConnection(this._db, this._config);
    this._factory = new StatementFactory(this._db, RAW_STATEMENTS);
    this.reloadCache();
  }

  public reloadCache() {
    this._emojiList = this._getEmojiList();
    this._state.updateState();
  }

  public validateRecordExists(record: TEmoji) {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_EMOJI_BY_ID);
    const response = statement.get(record);
    if (!response) {
      throw new DataQualityError('Emoji does not exist');
    }
  }

  public validateRecordNotExists(record: TEmoji) {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_EMOJI_BY_ID_OR_COMMAND);
    const response = statement.get(record);
    if (response) {
      throw new DataQualityError('Emoji already exist');
    }
  }

  public validateCommandNotExists(record: TEmoji) {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_EMOJI_BY_COMMAND);
    const response = statement.get(record);
    if (response) {
      throw new DataQualityError('Command already exist');
    }
  }

  protected _getEmojiList(): TEmoji[] {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_ALL_EMOJI);
    const response = statement.all();
    return response
      .map((item) => DbEmoji.parse(item))
      .map((dbEmoji) => {
        const emoji: TEmoji = {
          emojiId: dbEmoji.emoji_id,
          command: dbEmoji.command,
          src: dbEmoji.src,
          type: dbEmoji.type
        };
        return Emoji.parse(emoji);
      });
  }
}

export { EmojiDb };
