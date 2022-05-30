import { Logger } from '../app/logging/logger'
import { SANITIZE_MAP } from '../constants'
import { AqGameChatMessage } from '../shared/interfaces'
import { Socket } from '../types'

class ChatManager {
  protected _logger: Logger

  constructor(logger: Logger) {
    this._logger = logger
  }

  public generateUserMsg(socket: Socket, msg: string): AqGameChatMessage {
    return this._generateChatMsg(socket, msg)
  }

  protected _generateChatMsg(socket: Socket, msg: string): AqGameChatMessage {
    return {
      username: socket.data.username,
      admin: socket.data.admin,
      avatar: socket.data.avatar,
      sid: socket.id,
      repeat: false,
      text: this._sanitizeMsg(msg)
    }
  }

  protected _sanitizeMsg(msg: string): string {
    let output = msg
    for (const key in SANITIZE_MAP) {
      output = output.replace(new RegExp(key, 'g'), SANITIZE_MAP[key])
    }
    return output
  }
}

export {
  ChatManager
}
