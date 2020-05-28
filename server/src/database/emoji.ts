import {IEmoji} from '../../../shared/interfaces/database'
import {readFile, writeFile} from './helper'
import {EMOJI_LIST_PATH} from '../config'
import {ServerDataError} from '../exceptions'

class EmojiDatabase {
  protected _emojiList: Array<IEmoji>
  protected _commands: Set<string>
  protected _commandFormat = new RegExp('^[A-Za-z0-9]{1,20}$')

  constructor() {
    this.loadData()
  }

  public loadData(): void {
    this._emojiList = readFile(EMOJI_LIST_PATH)
    this._commands = new Set(this._emojiList.map((emoji: IEmoji): string => {
      return emoji.command.toLowerCase()
    }))
  }

  public getEmojiList(): Array<IEmoji> {
    return this._emojiList
  }

  public addEmoji(emoji: IEmoji): void {
    this._validateEmojiNotExists(emoji)
    this._validateEmojiFields(emoji)
    this._emojiList.push(emoji)
    this._commands.add(emoji.command.toLowerCase())
    this._saveList()
  }

  public editEmoji(emojiToEdit: IEmoji): void {
    this._validateEmojiExists(emojiToEdit)
    this._validateEmojiFields(emojiToEdit)
    let index = this._emojiList.findIndex((emoji: IEmoji) => {
      return emoji.command.toLowerCase() == emojiToEdit.command.toLowerCase()
    })
    this._emojiList[index] = emojiToEdit
    this._saveList()
  }

  public deleteEmoji(emojiToDelete: IEmoji): void {
    this._validateEmojiExists(emojiToDelete)
    let index = this._emojiList.findIndex((emoji: IEmoji) => {
      return emoji.command.toLowerCase() == emojiToDelete.command.toLowerCase()
    })
    this._emojiList.splice(index, 1)
    this._commands.delete(emojiToDelete.command.toLowerCase())
    this._saveList()
  }

  protected _validateEmojiNotExists(emoji: IEmoji): void {
    if (this._commands.has(emoji.command.toLowerCase())) {
      throw new ServerDataError('Emoji command already in database')
    }
  }

  protected _validateEmojiExists(emoji: IEmoji): void {
    if (!this._commands.has(emoji.command.toLowerCase())) {
      throw new ServerDataError('Emoji command not in database')
    }
  }

  protected _validateEmojiFields(emoji: IEmoji): void {
    if (!emoji.src || !emoji.command.match(this._commandFormat) || !emoji.type) {
      throw  new ServerDataError('Invalid emoji field')
    }
  }

  protected _saveList(): void {
    writeFile(EMOJI_LIST_PATH, this._emojiList)
  }
}

export {EmojiDatabase}
