import { AbstractDb } from './abstract';
import { Logger } from '../app/logging/logger';
import { ServerConfig } from '../app/config';
import { AqEmoji } from '../shared/interfaces';
import { LOG_BASE } from '../app/logging/log-base';
import { GameDataValidationError } from '../app/exceptions';
import { v4 } from 'uuid';

class AnimeQuizEmojiDb extends AbstractDb {
  protected _emojiListCache: AqEmoji[];

  constructor(config: ServerConfig, logger: Logger) {
    super(logger, config.mainDbPath);
    this.reloadCache();
  }

  public reloadCache(): void {
    const sql = `
      SELECT
        *
      FROM emojis
    `;
    this._emojiListCache = this._db.prepare(sql).all();
  }

  public deleteEmoji(emoji: AqEmoji): void {
    const sql = `DELETE FROM emojis WHERE emoji_id = ?`;
    this._db.prepare(sql).run([emoji.emoji_id]);
    this.reloadCache();
  }

  public newEmoji(emoji: AqEmoji): void {
    const emojiId = `emoji-${v4()}`;
    const sql = `INSERT INTO emojis (emoji_id, command, src, type) VALUES (?,?,?,?)`;
    this._db
      .prepare(sql)
      .run([
        emojiId,
        this._sanitizeString(emoji.command).toLowerCase(),
        this._sanitizeString(emoji.src),
        this._sanitizeString(emoji.type)
      ]);
    this.reloadCache();
  }

  public editEmoji(emoji: AqEmoji): void {
    const sql = `
      UPDATE emojis
      SET 
        command = ?,
        src = ?,
        type = ?
      WHERE emoji_id = ?
    `;
    this._db
      .prepare(sql)
      .run([
        this._sanitizeString(emoji.command).toLowerCase(),
        this._sanitizeString(emoji.src),
        this._sanitizeString(emoji.type),
        emoji.emoji_id
      ]);
    this.reloadCache();
  }

  public getEmojiList(): AqEmoji[] {
    return this._emojiListCache;
  }

  public validateEmojiCommandNotExist(emojiCommand: string): void {
    const sql = `
      SELECT
        *
      FROM emojis
      WHERE emojis.command = ?
    `;
    const emojis = this._db.prepare(sql).all([this._sanitizeString(emojiCommand).toLowerCase()]);
    if (emojis.length > 0) {
      this._logger.writeLog(LOG_BASE.EMOJI_DATA_VALIDATION_FAILURE, { emojiCommand: emojiCommand });
      throw new GameDataValidationError('Emoji command already exists');
    }
  }

  public validateEmojiExist(emojiId: string): void {
    const sql = `
      SELECT
        *
      FROM emojis
      WHERE emojis.emoji_id = ?
    `;
    const emojis = this._db.prepare(sql).all([emojiId]);
    if (emojis.length <= 0) {
      this._logger.writeLog(LOG_BASE.EMOJI_DATA_VALIDATION_FAILURE, { emojiId: emojiId });
      throw new GameDataValidationError('Emoji does not exist');
    }
  }
}

export { AnimeQuizEmojiDb };
