import { AbstractEmitter } from './abstract'
import { AqEmoji } from '../shared/interfaces'
import { SHARED_EVENTS } from '../shared/events'
import { Server } from '../app/server'
import { AnimeQuizEmojiDb } from '../database/emoji'

class EmojiDbEmitter extends AbstractEmitter {
  protected _emojiDb: AnimeQuizEmojiDb

  constructor(io: Server, emojiDb: AnimeQuizEmojiDb) {
    super(io)
    this._emojiDb = emojiDb
  }

  public updateEmojiList(sid: string = null): void {
    this._client(sid).emit(SHARED_EVENTS.UPDATE_EMOJI_LIST, this._emojiDb.getEmojiList())
  }
}

export {
  EmojiDbEmitter
}
