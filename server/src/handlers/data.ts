import { AbstractHandler } from './abstract'
import { Logger } from '../app/logging/logger'
import { Socket } from '../types'
import { SHARED_EVENTS } from '../shared/events'
import { SongDbEmitter } from '../emitters/song'
import { EmojiDbEmitter } from '../emitters/emoji'
import { UserDbEmitter } from '../emitters/user'

class AqDataHandler extends AbstractHandler {
  protected _songDbEmitter: SongDbEmitter
  protected _emojiDbEmitter: EmojiDbEmitter
  protected _userDbEmitter: UserDbEmitter

  constructor(
    logger: Logger,
    songDbEmitter: SongDbEmitter,
    emojiDbEmitter: EmojiDbEmitter,
    userDbEmitter: UserDbEmitter
  ) {
    super(logger)
    this._songDbEmitter = songDbEmitter
    this._emojiDbEmitter = emojiDbEmitter
    this._userDbEmitter = userDbEmitter
  }

  public start(socket: Socket, errorHandler: Function) {
    socket.on(SHARED_EVENTS.GET_ANIME_LIST, () => {
      try {
        this._songDbEmitter.updateAnimeList(socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.GET_SONG_LIST, () => {
      try {
        this._songDbEmitter.updateSongList(socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.GET_SONG_TITLE_LIST, () => {
      try {
        this._songDbEmitter.updateSongTitleList(socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.GET_EMOJI_LIST, () => {
      try {
        this._emojiDbEmitter.updateEmojiList(socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })

    socket.on(SHARED_EVENTS.GET_USER_LISTS, () => {
      try {
        this._userDbEmitter.updateUserLists(socket.id)
      } catch (e) {
        errorHandler(e)
      }
    })
  }
}

export { AqDataHandler }
