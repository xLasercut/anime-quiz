import { AbstractDb } from '../abstract';
import { IEmoji } from '../../shared/interfaces';
import { ServerConfig } from '../../app/config';
import { Logger } from '../../app/logging/logger';
import { LOG_BASE } from '../../app/logging/log-base';
import { GameDataValidationError } from '../../app/exceptions';
import { EmojiDbStatements } from './sql';
import * as Database from 'better-sqlite3';

class EmojiDb extends AbstractDb {
  protected _emojiListCache: IEmoji[];
  protected _statements: EmojiDbStatements;

  constructor(config: ServerConfig, logger: Logger) {
    super(logger, config.mainDbPath);
    this.reloadDb();
    this.reloadCache();
  }

  public reloadDb(): void {
    this._closeDb();
    this._db = new Database(this._filepath, { fileMustExist: true });
    this._statements = new EmojiDbStatements(this._db);
  }

  public reloadCache(): void {
    this._emojiListCache = this._statements.getAllEmoji.all();
  }

  public deleteEmoji(emoji: IEmoji): void {
    this._statements.deleteEmojiById.run([emoji.emoji_id]);
    this.reloadCache();
  }

  public newEmoji(emoji: IEmoji): void {
    this._statements.insertEmoji.run([emoji.emoji_id, emoji.command, emoji.src, emoji.type]);
    this.reloadCache();
  }

  public editEmoji(emoji: IEmoji): void {
    this._statements.updateEmojiById.run([emoji.command, emoji.src, emoji.type, emoji.emoji_id]);
    this.reloadCache();
  }

  public getEmojiList(): IEmoji[] {
    return this._emojiListCache;
  }

  public validateEmojiExist(emojiId: string): void {
    const emojis = this._statements.getEmojiById.all([emojiId]);
    if (emojis.length <= 0) {
      this._logger.writeLog(LOG_BASE.EMOJI_DATA_VALIDATION_FAILURE, { emojiId: emojiId });
      throw new GameDataValidationError('Emoji does not exist');
    }
  }

  public validateEmojiCommandNotExist(emojiCommand: string): void {
    const emojis = this._statements.getEmojiByCommand.all([emojiCommand]);
    if (emojis.length > 0) {
      this._logger.writeLog(LOG_BASE.EMOJI_DATA_VALIDATION_FAILURE, { emojiCommand: emojiCommand });
      throw new GameDataValidationError('Emoji command already exists');
    }
  }
}

export { EmojiDb };
