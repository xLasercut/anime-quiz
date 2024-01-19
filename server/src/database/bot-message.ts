import { DatabaseDataState, mainDbConnection, ServerDb } from './common';
import { BotMessageType, MessageCommandType } from '../shared/models/types';
import { Database as SqliteDb } from 'better-sqlite3';
import { ServerConfig } from '../interfaces';
import { Logger } from 'winston';
import { StatementFactory } from './statement';
import { DbBotMessage } from '../models/bot-message';
import { BotMessage } from '../shared/models/bot-message';
import { DataQualityError } from '../app/exceptions';

const STATEMENTS = {
  SELECT_ALL_BOT_MESSAGE: 'SELECT_ALL_BOT_MESSAGE',
  SELECT_BOT_MESSAGE_BY_ID_OR_COMMAND: 'SELECT_BOT_MESSAGE_BY_ID_OR_COMMAND',
  SELECT_BOT_MESSAGE_BY_ID: 'SELECT_BOT_MESSAGE_BY_ID',
  SELECT_BOT_MESSAGE_BY_COMMAND: 'SELECT_BOT_MESSAGE_BY_COMMAND',
  INSERT_BOT_MESSAGE: 'INSERT_BOT_MESSAGE',
  EDIT_BOT_MESSAGE: 'EDIT_BOT_MESSAGE',
  DELETE_BOT_MESSAGE: 'DELETE_BOT_MESSAGE'
};

const RAW_STATEMENTS = {
  [STATEMENTS.SELECT_ALL_BOT_MESSAGE]: `
    SELECT
      * 
    FROM bot_messages
  `,
  [STATEMENTS.SELECT_BOT_MESSAGE_BY_ID_OR_COMMAND]: `
    SELECT
      *
    FROM bot_messages
    WHERE message_id = @messageId OR command = @command
  `,
  [STATEMENTS.INSERT_BOT_MESSAGE]: `
    INSERT INTO bot_messages 
      (message_id, command, text, avatar, display_name, user_id) 
    VALUES 
      (@messageId, @command, @text, @avatar, @displayName, @userId)
  `,
  [STATEMENTS.SELECT_BOT_MESSAGE_BY_ID]: `
    SELECT
      *
    FROM bot_messages
    WHERE message_id = @messageId
  `,
  [STATEMENTS.SELECT_BOT_MESSAGE_BY_COMMAND]: `
    SELECT
      *
    FROM bot_messages
    WHERE command = @command AND message_id != @messageId
  `,
  [STATEMENTS.EDIT_BOT_MESSAGE]: `
    UPDATE bot_messages 
    SET 
      command = @command, 
      text = @text, 
      avatar = @avatar,
      display_name = @displayName,
      user_id = @userId 
    WHERE message_id = @messageId
  `,
  [STATEMENTS.DELETE_BOT_MESSAGE]: `
    DELETE FROM bot_messages
    WHERE message_id = @messageId
  `
};

class BotMessageDb extends ServerDb<BotMessageType> {
  protected _db: SqliteDb;
  protected _factory: StatementFactory;
  protected _messageList: BotMessageType[] = [];

  constructor(config: ServerConfig, logger: Logger, state: DatabaseDataState) {
    super(config, logger, state);
    this._db = mainDbConnection(null, config);
    this._factory = new StatementFactory(this._db, RAW_STATEMENTS);
    this.reloadCache();
  }

  public get messageList(): BotMessageType[] {
    return this._messageList;
  }

  public newRecord(record: BotMessageType) {
    const statement = this._factory.getStatement(STATEMENTS.INSERT_BOT_MESSAGE);
    statement.run(record);
    this.reloadCache();
  }

  public editRecord(record: BotMessageType) {
    const statement = this._factory.getStatement(STATEMENTS.EDIT_BOT_MESSAGE);
    statement.run(record);
    this.reloadCache();
  }

  public deleteRecord(record: BotMessageType) {
    const statement = this._factory.getStatement(STATEMENTS.DELETE_BOT_MESSAGE);
    statement.run(record);
    this.reloadCache();
  }

  public validateRecordExists(record: BotMessageType) {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_BOT_MESSAGE_BY_ID);
    const response = statement.get(record);
    if (!response) {
      throw new DataQualityError('Bot message does not exist');
    }
  }

  public validateRecordNotExists(record: BotMessageType) {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_BOT_MESSAGE_BY_ID_OR_COMMAND);
    const response = statement.get(record);
    if (response) {
      throw new DataQualityError('Bot message already exist');
    }
  }

  public validateCommandNotExists(record: BotMessageType) {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_BOT_MESSAGE_BY_COMMAND);
    const response = statement.get(record);
    if (response) {
      throw new DataQualityError('Command already exist');
    }
  }

  public reloadDb() {
    this._db = mainDbConnection(this._db, this._config);
    this._factory = new StatementFactory(this._db, RAW_STATEMENTS);
    this.reloadCache();
  }

  public reloadCache() {
    this._messageList = this._getMessageList();
  }

  protected _getMessageList(): BotMessageType[] {
    const statement = this._factory.getStatement(STATEMENTS.SELECT_ALL_BOT_MESSAGE);
    const response = statement.all();
    return response
      .map((item) => DbBotMessage.parse(item))
      .map((dbBotMessage) => {
        const botMessage: BotMessageType = {
          messageId: dbBotMessage.message_id,
          command: dbBotMessage.command,
          avatar: dbBotMessage.avatar,
          text: dbBotMessage.text,
          userId: dbBotMessage.user_id,
          displayName: dbBotMessage.display_name
        };
        return BotMessage.parse(botMessage);
      });
  }

  public getBotMessageByCommand(command: MessageCommandType): BotMessageType | undefined {
    for (const botMessage of this._messageList) {
      if (botMessage.command.toLowerCase() === command.toLowerCase()) {
        return botMessage;
      }
    }
    return undefined;
  }
}

export { BotMessageDb };
