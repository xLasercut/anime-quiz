import { AbstractEmitter } from './abstract';
import { SHARED_EVENTS } from '../shared/events';
import { Server } from '../app/server';
import { EmojiDb } from '../database/emoji';

class EmojiDbEmitter extends AbstractEmitter {
  protected _emojiDb: EmojiDb;

  constructor(io: Server, emojiDb: EmojiDb) {
    super(io);
    this._emojiDb = emojiDb;
  }

  public updateEmojiList(sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_EMOJI_LIST, this._emojiDb.getEmojiList());
  }
}

export { EmojiDbEmitter };
