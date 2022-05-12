import { Database } from 'sqlite3'
import { ServerConfig } from './config'
import { AqAnimeSerialised, AqSongSerialised } from '../shared/interfaces'
import { AqSongRaw } from '../interfaces'

class AnimeQuizDb {
  protected _db: Database

  constructor(config: ServerConfig) {
    this._db = new Database(config.songDbPath)
  }

  protected async _all(sql: string, params: string[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this._db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows)
      })
    })
  }

  public async getAllSongList(): Promise<AqSongSerialised[]> {
    const songList: AqSongRaw[] = await this._all(`
      SELECT
        song_id,
        src,
        song_title,
        type,
        artist,
        songs.anime_id,
        json_group_array(anime_name) as anime_name
      FROM animes
        INNER JOIN songs
          ON songs.anime_id = animes.anime_id
      GROUP BY songs.song_id
    `)

    return songList.map((row) => {
      const { anime_name, ...rest } = row
      return {
        anime_name: JSON.parse(anime_name),
        ...rest
      }
    })
  }

  public async getAnimeList(): Promise<AqAnimeSerialised[]> {
    return await this._all(`
      SELECT
        *
      FROM animes
    `)
  }
}

export {
  AnimeQuizDb
}
