import {LOG_BASE, Logger} from '../app/logging'
import {ChatBotDatabase} from '../database/chat-bot'
import {EmojiDatabase} from '../database/emoji'
import {IChat} from '../../../shared/interfaces/game'
import {GameDataError} from '../exceptions'
import {text} from 'express'

let SANITIZE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\\/': '&sol;',
  '\'': '&apos;'
}

class ChatManager {
  protected _logger: Logger
  protected _chatBotDatabase: ChatBotDatabase
  protected _emojiDatabase: EmojiDatabase

  constructor(logger: Logger, chatBotDatabase: ChatBotDatabase, emojiDatabase: EmojiDatabase) {
    this._logger = logger
    this._chatBotDatabase = chatBotDatabase
    this._emojiDatabase = emojiDatabase
  }

  public generateUserMsg(sid: string, username: string, admin: boolean, avatar: string, msg: string): IChat {
    this._logger.writeLog(LOG_BASE.CHAT003, {
      id: sid,
      username: username,
      message: msg
    })
    return this._generateChatMsg(sid, username, admin, avatar, msg)
  }

  public generateSysMsg(msg: string): IChat {
    return this._generateChatMsg('eva_bot', 'Eva Unit-01', false, 'eva_unit_1', msg)
  }

  public generateBotMsg(msg: string): IChat {
    let chatBot = this._chatBotDatabase.getChatBot(msg)
    if (chatBot) {
      return this._generateChatMsg(
        chatBot.userId,
        chatBot.user,
        false,
        chatBot.avatar,
        `:notes: ${chatBot.text} :notes:`
      )
    }
  }

  protected _generateChatMsg(sid: string, username: string, admin: boolean, avatar: string, msg: string): IChat {
    return {
      user: username,
      admin: admin,
      avatar: avatar,
      userId: sid,
      repeat: false,
      text: this._addEmoji(this._sanitizeMsg(msg))
    }
  }

  protected _sanitizeMsg(msg: string): string {
    let output = msg
    for (let key in SANITIZE_MAP) {
      output = output.replace(new RegExp(key, 'g'), SANITIZE_MAP[key])
    }
    return output
  }

  protected _addEmoji(msg: string): string {
    let output = msg
    for (let emoji of this._emojiDatabase.getEmojiList()) {
      let command = new RegExp(`:${emoji.command}:`, 'gi')
      let type = emoji.type
      let src = emoji.src

      if (type === 'img') {
        output = output.replace(command, `<img src="${src}" class="emoji" />`)
      }
      else if (type === 'dec') {
        output = output.replace(command, src)
      }
      else {
        throw new GameDataError('Cannot render emoji - Invalid emoji source')
      }
    }
    return output
  }
}

export {ChatManager}
