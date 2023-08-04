import { AbstractDb } from './common';
import { ServerConfig } from '../interfaces';
import { Logger } from '../app/logging/logger';
import { EmojiType } from '../shared/models/types';
import { DbEmoji } from '../models/emoji';
import { Emoji } from '../shared/models/emoji';

class EmojiDb extends AbstractDb {
  constructor(config: ServerConfig, logger: Logger) {
    super(config.mainDbPath, logger);
  }

  public getEmojiList(): EmojiType[] {
    const statement = this._db.prepare(`
      SELECT
        *
      FROM emojis
    `);
    const response = statement.all();
    return response
      .map((item) => DbEmoji.parse(item))
      .map((dbEmoji) => {
        const emoji: EmojiType = {
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
