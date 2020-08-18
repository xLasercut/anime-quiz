import * as fs from 'fs'
import {AMQ_USER_DATA_DIR} from '../config'
import * as path from 'path'
import {readFile, setDifference, setIntersect, setUnion, writeFile} from './helper'
import {ServerDataError} from '../exceptions'
import {AmqSongDatabase} from './amq-song'
import {IBalancedAmqSongLists, INormalAmqSongLists} from '../interfaces'

class AmqUserSongDatabase {
  protected _userSongList: { [key: string]: AmqUserSong }
  protected _fileFormat = new RegExp('.*\.json$', 'ig')
  protected _songDatabase: AmqSongDatabase

  constructor(songDatabase: AmqSongDatabase) {
    this._songDatabase = songDatabase
    this.loadData()
  }

  public loadData(): void {
    this._userSongList = {}

    for (let filename of fs.readdirSync(AMQ_USER_DATA_DIR)) {
      if (filename.match(this._fileFormat)) {
        let user = filename.replace('.json', '')
        let filepath = path.join(AMQ_USER_DATA_DIR, filename)
        this._userSongList[user] = new AmqUserSong(filepath)
      }
    }
  }

  public getUsers(): Array<string> {
    return Object.keys(this._userSongList)
  }

  public getUserSongs(user: string): Array<string> {
    this._validateUserExists(user)
    return Array.from(this._userSongList[user].getUserSongs())
  }

  public addSongId(songId: string, user: string): void {
    this._validateUserExists(user)
    this._songDatabase.validateSongIdExists(songId)
    this._userSongList[user].addSongId(songId)
  }

  public deleteSongId(songId: string, user: string): void {
    this._validateUserExists(user)
    this._userSongList[user].deleteSongId(songId)
  }

  public generateBalancedSongLists(users: Array<string>, playedSongIds: Set<string>): IBalancedAmqSongLists {
    let balancedSongLists: IBalancedAmqSongLists = {}
    for (let user of users) {
      this._validateUserExists(user)
      let userList = this._userSongList[user].getUserSongs()
      let priorityUserList = setIntersect(userList, playedSongIds)
      balancedSongLists[user] = {
        normal: this._songDatabase.getFilteredSongList(setDifference(userList, priorityUserList)),
        priority: this._songDatabase.getFilteredSongList(priorityUserList)
      }
    }

    return balancedSongLists
  }

  public generateCombinedSongLists(users: Array<string>, playedSongIds: Set<string>): INormalAmqSongLists {
    let combinedList: Set<string> = new Set()
    for (let user of users) {
      this._validateUserExists(user)
      combinedList = setUnion(combinedList, this._userSongList[user].getUserSongs())
    }

    let priorityList = setIntersect(combinedList, playedSongIds)

    return {
      normal: this._songDatabase.getFilteredSongList(setDifference(combinedList, priorityList)),
      priority: this._songDatabase.getFilteredSongList(priorityList)
    }
  }

  protected _validateUserExists(user: string): void {
    if (!(user in this._userSongList)) {
      throw new ServerDataError('User does not exist')
    }
  }
}


class AmqUserSong {
  protected _songIds: Set<string>
  protected _filepath: string

  constructor(filepath: string) {
    this._filepath = filepath
    this.loadData()
  }

  public getUserSongs(): Set<string> {
    return this._songIds
  }

  public addSongId(songId: string): void {
    this._validateSongIdNotExists(songId)
    this._songIds.add(songId)
    this._saveList()
  }

  public deleteSongId(songId: string): void {
    this._validateSongIdExists(songId)
    this._songIds.delete(songId)
    this._saveList()
  }

  public loadData(): void {
    this._songIds = new Set(readFile(this._filepath))
  }

  protected _validateSongIdExists(songId: string): void {
    if (!this._songIds.has(songId)) {
      throw new ServerDataError('Song ID is not in user list')
    }
  }

  protected _validateSongIdNotExists(songId: string): void {
    if (this._songIds.has(songId)) {
      throw new ServerDataError('Song ID already added to user list')
    }
  }

  protected _saveList(): void {
    writeFile(this._filepath, Array.from(this._songIds))
  }
}


export {AmqUserSongDatabase}
