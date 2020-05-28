import {IChatBot} from '../../../shared/interfaces/database'
import {readFile, writeFile} from './helper'
import {CHAT_BOT_LIST_PATH} from '../config'
import {GameDataError} from '../exceptions'

class ChatBotDatabase {
  protected _chatBotList: Array<IChatBot>
  protected _regexes: Set<string>

  constructor() {
    this.loadData()
  }

  public loadData(): void {
    this._chatBotList = readFile(CHAT_BOT_LIST_PATH)
    this._regexes = new Set(this._chatBotList.map((chatBot: IChatBot) => {
      return chatBot.regex
    }))
  }

  public getChatBotList(): Array<IChatBot> {
    return this._chatBotList
  }

  public addChatBot(chatBot: IChatBot): void {
    this._validateChatBotNotExists(chatBot)
    this._chatBotList.push(chatBot)
    this._regexes.add(chatBot.regex)
    this._saveList()
  }

  public editChatBot(chatBotToEdit: IChatBot): void {
    this._validChatBotExists(chatBotToEdit)
    let index = this._chatBotList.findIndex((chatBot: IChatBot) => {
      return chatBot.regex === chatBotToEdit.regex
    })
    this._chatBotList[index] = chatBotToEdit
    this._saveList()
  }

  public deleteChatBot(chatBotToDelete: IChatBot): void {
    this._validChatBotExists(chatBotToDelete)
    let index = this._chatBotList.findIndex((chatBot: IChatBot) => {
      return chatBot.regex === chatBotToDelete.regex
    })
    this._chatBotList.splice(index, 1)
    this._regexes.delete(chatBotToDelete.regex)
    this._saveList()
  }

  protected _validChatBotExists(chatBot: IChatBot): void {
    if (!this._regexes.has(chatBot.regex)) {
      throw new GameDataError('Chat bot regex not in database')
    }
  }

  protected _validateChatBotNotExists(chatBot: IChatBot): void {
    if (this._regexes.has(chatBot.regex)) {
      throw new GameDataError('Chat bot regex already in database')
    }
  }

  protected _saveList(): void {
    writeFile(CHAT_BOT_LIST_PATH, this._chatBotList)
  }
}

export {ChatBotDatabase}
