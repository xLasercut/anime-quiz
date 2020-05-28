import {IChatBot} from '../../../shared/interfaces/database'
import {readFile} from './helper'
import {CHAT_BOT_LIST_PATH} from '../config'

class ChatBotDatabase {
  protected _chatBotList: Array<IChatBot>

  constructor() {
    this.loadData()
  }

  public loadData(): void {
    this._chatBotList = readFile(CHAT_BOT_LIST_PATH)
  }

  public getChatBotList(): Array<IChatBot> {
    return this._chatBotList
  }
}

export {ChatBotDatabase}
