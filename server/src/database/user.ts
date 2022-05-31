import { Database, OPEN_READWRITE } from 'sqlite3'
import { ServerConfig } from '../app/config'
import { AbstractDb } from './abstract'
import { AqUserSongs } from '../shared/interfaces'
import { AqUserSongsRaw } from '../interfaces'
import { GameDataValidationError } from '../app/exceptions'
import { LOG_BASE } from '../app/logging/log-base'
import { Logger } from '../app/logging/logger'

class AnimeQuizUserDb extends AbstractDb {
  constructor(config: ServerConfig, logger: Logger) {
    super(config.userDbPath, logger)
  }

  public async getUserLists(): Promise<AqUserSongs[]> {
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
    const userLists: AqUserSongsRaw[] = await this._all(sql)
    return userLists.map((userList) => {
      const { song_id, ...rest } = userList
      return {
        song_id: JSON.parse(song_id),
        ...rest
      }
    })
  }

  public async getSelectedUserLists(userIds: string[]): Promise<AqUserSongs[]> {
    if (userIds.length <= 0) {
      return []
    }

    const sql = `
      SELECT 
        users.user_id,
        username,
        json_group_array(song_id) as song_id 
      FROM users
        LEFT JOIN user_songs
        ON users.user_id = user_songs.user_id
      WHERE users.user_id IN (${this._questionString(userIds.length)})
      GROUP BY users.user_id
    `
    const userLists: AqUserSongsRaw[] = await this._all(sql, userIds)
    return userLists.map((userList) => {
      const { song_id, ...rest } = userList
      return {
        song_id: JSON.parse(song_id),
        ...rest
      }
    })
  }

  public async getSelectedUserSongIds(userIds: string[]): Promise<string[]> {
    const sql = `
      SELECT DISTINCT
        song_id
      FROM user_songs
      WHERE user_id in (${this._questionString(userIds.length)})
    `

    const userSongs: AqUserSongsRaw[] = await this._all(sql, userIds)

    return userSongs.map((song) => {
      return song.song_id
    })
  }

  public async addSongs(userId: string, songIds: string[]): Promise<void> {
    const sql = `INSERT INTO user_songs (user_id, song_id) VALUES (?,?)`
    for (const songId of songIds) {
      await this._run(sql, [ userId, songId ])
    }
  }

  public async removeSongs(userId: string, songIds: string[]): Promise<void> {
    const sql = `DELETE FROM user_songs WHERE user_id = ? AND song_id = ?`
    for (const songId of songIds) {
      await this._run(sql, [ userId, songId ])
    }
  }

  public async removeSongAll(songId: string): Promise<void> {
    const sql = `DELETE FROM user_songs WHERE song_id = ?`
    await this._run(sql, [ songId ])
  }

  public async validateUserExist(userId: string): Promise<void> {
    const sql = `
      SELECT
        *
      FROM users
      WHERE user_id = ?
    `
    const users = await this._all(sql, [ userId ])

    if (users.length !== 1) {
      this._logger.writeLog(LOG_BASE.SONG001, { userId: userId })
      throw new GameDataValidationError('User does not exist')
    }
  }

  public async validateSongsNotExistsInUserList(userId: string, songIds: string[]): Promise<void> {
    const params = [ userId ].concat(songIds)
    const sql = `
      SELECT 
        song_id 
      FROM user_songs 
      WHERE user_id = ? AND 
            song_id IN (${this._questionString(songIds.length)})
    `

    const existSongs = await this._all(sql, params)

    if (existSongs.length > 0) {
      this._logger.writeLog(LOG_BASE.SONG003, { songIds: existSongs })
      throw new GameDataValidationError('Song already exists in list')
    }
  }

  public async validateSongsExistsInUserList(userId: string, songIds: string[]): Promise<void> {
    const params = [ userId ].concat(songIds)
    const sql = `
      SELECT 
        song_id
      FROM user_songs 
      WHERE user_id = ? AND 
            song_id IN (${this._questionString(songIds.length)})
    `

    const notExistsSongs = await this._all(sql, params)

    if (notExistsSongs.length !== songIds.length) {
      this._logger.writeLog(LOG_BASE.SONG004, { songIds: notExistsSongs })
      throw new GameDataValidationError('Song does not exist in list')
    }
  }
}


export {
  AnimeQuizUserDb
}
