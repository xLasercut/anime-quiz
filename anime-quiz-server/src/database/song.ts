import { Database, OPEN_READWRITE } from 'sqlite3'
import { ServerConfig } from '../app/config'
import { AqSong } from '../shared/interfaces'
import { AqAnimeRaw, AqSongRaw } from '../interfaces'
import { AbstractDb } from './abstract'
import { Logger } from '../app/logging/logger'
import { LOG_BASE } from '../app/logging/log-base'
import { GameDataValidationError } from '../app/exceptions'

class AnimeQuizSongDb extends AbstractDb {
  constructor(config: ServerConfig, logger: Logger) {
    super(new Database(config.songDbPath, OPEN_READWRITE), logger)
  }

  public async getAllSongList(): Promise<AqSong[]> {
    const songList: AqSongRaw[] = await this._all(`
      SELECT
        songs.song_id,
        src,
        song_title,
        type,
        artist,
        song_animes.anime_id,
        json_group_array(anime_name) as anime_name
      FROM animes
        INNER JOIN song_animes ON animes.anime_id = song_animes.anime_id
        INNER JOIN songs ON songs.song_id = song_animes.song_id
      GROUP BY songs.song_id
    `)

    return songList.map((row) => {
      const { anime_name, song_title, ...rest } = row
      return {
        anime_name: JSON.parse(anime_name),
        song_title: song_title || '',
        ...rest
      }
    })
  }

  public async getAnimeList(): Promise<string[]> {
    const animeList: AqAnimeRaw[] = await this._all(`
      SELECT
        *
      FROM animes
    `)
    return animeList.map((anime) => {
      return anime.anime_name
    })
  }

  public async getSongTitleList(): Promise<string[]> {
    const songList: AqSongRaw[] = await this._all(`
      SELECT
        *
      FROM songs
    `)
    return songList.map((song) => {
      return song.song_title
    })
  }

  public async validateSongsExist(songIds: string[]): Promise<void> {
    const sql = `
      SELECT
        song_id
      FROM songs
      WHERE song_id IN (${this._questionString(songIds.length)})
    `
    const existSongs = await this._all(sql, songIds)

    if (existSongs.length != songIds.length) {
      this._logger.writeLog(LOG_BASE.SONG002, { songIds: songIds })
      throw new GameDataValidationError('Song does not exist')
    }
  }
}

export {
  AnimeQuizSongDb
}
