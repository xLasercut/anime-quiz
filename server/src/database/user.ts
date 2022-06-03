import { ServerConfig } from '../app/config'
import { AqUserSongs } from '../shared/interfaces'
import { AqUserSongsRaw } from '../interfaces'
import { GameDataValidationError } from '../app/exceptions'
import { LOG_BASE } from '../app/logging/log-base'
import { Logger } from '../app/logging/logger'
import { AbstractDb } from './abstract'

class AnimeQuizUserDb extends AbstractDb {
  protected _userListsCache: AqUserSongs[]

  constructor(config: ServerConfig, logger: Logger) {
    super(logger, config.userDbPath)
    this.reloadCache()
  }

  public reloadCache(): void {
    this._userListsCache = this._getUserLists()
  }

  protected _getUserLists(): AqUserSongs[] {
    const sql = `
      SELECT 
        users.user_id,
        username,
        json_group_array(song_id) as song_id 
      FROM users
        LEFT JOIN user_songs
        ON users.user_id = user_songs.user_id
      GROUP BY users.user_id
    `
    const userLists: AqUserSongsRaw[] = this._db.prepare(sql).all()
    return userLists.map((userList) => {
      const { song_id, ...rest } = userList
      return {
        song_id: JSON.parse(song_id),
        ...rest
      }
    })
  }

  public getUserLists(): AqUserSongs[] {
    return this._userListsCache
  }

  public getSelectedUserLists(userIds: string[]): AqUserSongs[] {
    return this._userListsCache.filter((userList) => {
      return userIds.includes(userList.user_id)
    })
  }

  public getSelectedUserSongIds(userIds: string[]): string[] {
    return Array.from(new Set(
      this._userListsCache.filter((userList) => {
        return userIds.includes(userList.user_id)
      }).map((userList) => {
        return userList.song_id
      }).flat(1)
    ))
  }

  public addSongs(userId: string, songIds: string[]): void {
    const sql = `INSERT INTO user_songs (user_id, song_id) VALUES (?,?)`
    const insert = this._db.prepare(sql)
    const insertMany = this._db.transaction((_songIds: string[]) => {
      for (const songId of _songIds) {
        insert.run([userId, songId])
      }
    })
    insertMany(songIds)
    this.reloadCache()
  }

  public removeSongs(userId: string, songIds: string[]): void {
    const sql = `DELETE FROM user_songs WHERE user_id = ? AND song_id = ?`
    const remove = this._db.prepare(sql)
    const removeMany = this._db.transaction((_songIds: string[]) => {
      for (const songId of _songIds) {
        remove.run([ userId, songId ])
      }
    })
    removeMany(songIds)
    this.reloadCache()
  }

  public removeSongAll(songId: string): void {
    const sql = `DELETE FROM user_songs WHERE song_id = ?`
    this._db.prepare(sql).run([ songId ])
    this.reloadCache()
  }

  public validateUserExist(userId: string): void {
    const sql = `
      SELECT
        *
      FROM users
      WHERE user_id = ?
    `
    const users = this._db.prepare(sql).all([ userId ])

    if (users.length !== 1) {
      this._logger.writeLog(LOG_BASE.USER_DATA_VALIDATION_FAILURE, { userId: userId })
      throw new GameDataValidationError('User does not exist')
    }
  }

  public validateLessThanFiftySongs(songIds: string[]) {
    if (songIds.length > 50) {
      this._logger.writeLog(LOG_BASE.USER_DATA_VALIDATION_FAILURE, { songIds: songIds.length })
      throw new GameDataValidationError('Song list too long')
    }
  }

  public validateSongsNotExistsInUserList(userId: string, songIds: string[]): void {
    const params = [ userId ].concat(songIds)
    const sql = `
      SELECT 
        song_id 
      FROM user_songs 
      WHERE user_id = ? AND 
            song_id IN (${this._questionString(songIds.length)})
    `

    const existSongs = this._db.prepare(sql).all(params)

    if (existSongs.length > 0) {
      this._logger.writeLog(LOG_BASE.USER_DATA_VALIDATION_FAILURE, { songIds: songIds })
      throw new GameDataValidationError('Song already exists in list')
    }
  }

  public validateSongsExistsInUserList(userId: string, songIds: string[]): void {
    const params = [ userId ].concat(songIds)
    const sql = `
      SELECT 
        song_id
      FROM user_songs 
      WHERE user_id = ? AND 
            song_id IN (${this._questionString(songIds.length)})
    `

    const notExistsSongs = this._db.prepare(sql).all(params)

    if (notExistsSongs.length !== songIds.length) {
      this._logger.writeLog(LOG_BASE.USER_DATA_VALIDATION_FAILURE, { songIds: songIds })
      throw new GameDataValidationError('Song does not exist in list')
    }
  }
}


export {
  AnimeQuizUserDb
}
