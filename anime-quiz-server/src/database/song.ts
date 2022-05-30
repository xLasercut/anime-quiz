import { Database, OPEN_READWRITE } from 'sqlite3'
import { ServerConfig } from '../app/config'
import { AqAnime, AqSong } from '../shared/interfaces'
import { AqAnimeRaw, AqSongRaw } from '../interfaces'
import { AbstractDb } from './abstract'
import { Logger } from '../app/logging/logger'
import { LOG_BASE } from '../app/logging/log-base'
import { GameDataValidationError } from '../app/exceptions'
import { v4 } from 'uuid'
import { VALID_SONG_TYPES } from '../shared/constants'

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
        json_group_array(song_animes.anime_id) as anime_id,
        json_group_array(anime_name) as anime_name
      FROM animes
        INNER JOIN song_animes ON animes.anime_id = song_animes.anime_id
        INNER JOIN songs ON songs.song_id = song_animes.song_id
      GROUP BY songs.song_id
    `)

    return songList.map((row) => {
      const { anime_name, song_title, anime_id, ...rest } = row
      return {
        anime_name: JSON.parse(anime_name),
        song_title: song_title || '',
        anime_id: Array.from(new Set(JSON.parse(anime_id))),
        ...rest
      }
    })
  }

  public async getSelectedUserSongs(songIds: string[]): Promise<AqSong[]> {
    const sql = `
      SELECT
        songs.song_id,
        src,
        song_title,
        type,
        artist,
        json_group_array(song_animes.anime_id) as anime_id,
        json_group_array(anime_name) as anime_name
      FROM animes
        INNER JOIN song_animes ON animes.anime_id = song_animes.anime_id
        INNER JOIN songs ON songs.song_id = song_animes.song_id
      WHERE songs.song_id in (${this._questionString(songIds.length)})
      GROUP BY songs.song_id
      ORDER BY RANDOM()
    `
    const songList: AqSongRaw[] = await this._all(sql, songIds)
    return songList.map((row) => {
      const { anime_name, song_title, anime_id, ...rest } = row
      return {
        anime_name: JSON.parse(anime_name),
        song_title: song_title || '',
        anime_id: Array.from(new Set(JSON.parse(anime_id))),
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

  public async getAnimeListAdmin(): Promise<AqAnime[]> {
    const animeList: AqAnimeRaw[] = await this._all(`
      SELECT
        anime_id,
        json_group_array(anime_name) as anime_name
      FROM animes
      GROUP BY anime_id
    `)

    return animeList.map((anime) => {
      return {
        anime_id: anime.anime_id,
        anime_name: JSON.parse(anime.anime_name)
      }
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

  public async newAnime(anime: AqAnime): Promise<void> {
    this._validateAnimeNames(anime.anime_name)
    const animeId = `anime-${v4()}`
    await this._addAnime(animeId, anime.anime_name)
  }

  public async editAnime(anime: AqAnime): Promise<void> {
    this._validateAnimeNames(anime.anime_name)
    await this._deleteAnime(anime.anime_id)
    await this._addAnime(anime.anime_id, anime.anime_name)
  }

  public async deleteAnime(anime: AqAnime): Promise<void> {
    await this._deleteAnime(anime.anime_id)
  }

  public async newSong(song: AqSong): Promise<void> {
    this._validateSong(song)
    const songId = `song-${v4()}`
    await this._addSong(songId, song)
    await this._addSongAnime(songId, song.anime_id)
  }

  public async editSong(song: AqSong): Promise<void> {
    this._validateSong(song)
    await this._editSong(song.song_id, song)
    await this._deleteSongAnime(song.song_id)
    await this._addSongAnime(song.song_id, song.anime_id)
  }

  public async deleteSong(song: AqSong): Promise<void> {
    await this._deleteSong(song.song_id)
    await this._deleteSongAnime(song.song_id)
  }

  protected _validateSong(song: AqSong): void {
    this._validateString(song.song_title, 'Invalid title')
    this._validateString(song.src, 'Invalid src')
    this._validateSongType(song.type)
  }

  protected async _editSong(songId: string, song: AqSong): Promise<void> {
    const sql = `
      UPDATE songs
      SET 
        song_title = ?,
        src = ?,
        artist = ?,
        type = ?
      WHERE song_id = ?
    `
    await this._run(sql, [ song.song_title || null, song.src || null, song.artist || null, song.type || null, songId ])
  }

  protected async _deleteSong(songId: string): Promise<void> {
    const sql = `DELETE FROM songs WHERE song_id = ?`
    await this._run(sql, [ songId ])
  }

  protected async _deleteSongAnime(songId: string): Promise<void> {
    const sql = `DELETE FROM song_animes WHERE song_id = ?`
    await this._run(sql, [ songId ])
  }

  protected async _addSong(songId: string, song: AqSong): Promise<void> {
    const sql = `
      INSERT INTO songs 
        (song_id, song_title, src, artist, type) 
      VALUES 
        (?,?,?,?,?)
    `
    await this._run(sql, [ songId, song.song_title, song.src, song.artist, song.type ])
  }

  protected async _addSongAnime(songId: string, animeIds: string[]): Promise<void> {
    const sql = `INSERT INTO song_animes (song_id, anime_id) VALUES (?,?)`
    for (const animeId of animeIds) {
      await this._run(sql, [ songId, animeId ])
    }
  }

  protected _validateString(val: string, msg: string): void {
    if (!val || typeof val !== 'string') {
      throw new GameDataValidationError(msg)
    }
  }

  protected _validateSongType(type: string): void {
    if (!VALID_SONG_TYPES.includes(type)) {
      throw new GameDataValidationError('Invalid type')
    }
  }

  public async validateAnimeExist(animeIds: string[]): Promise<void> {
    const sql = `
      SELECT
        *
      FROM animes
      WHERE animes.anime_id IN (${this._questionString(animeIds.length)})
    `

    const existAnimes = await this._all(sql, animeIds)
    if (existAnimes.length < animeIds.length) {
      this._logger.writeLog(LOG_BASE.ADMIN001, { animeIds: animeIds })
      throw new GameDataValidationError('Anime does not exist')
    }
  }

  protected async _deleteAnime(animeId: string): Promise<void> {
    const sql = `DELETE FROM animes WHERE anime_id = ?`
    await this._run(sql, [ animeId ])
  }

  protected async _addAnime(animeId: string, animeNames: string[]): Promise<void> {
    const sql = `INSERT INTO animes (anime_id, anime_name) VALUES (?,?)`
    for (const animeName of animeNames) {
      await this._run(sql, [ animeId, animeName ])
    }
  }

  public async validateSongsExist(songIds: string[]): Promise<void> {
    const sql = `
      SELECT
        song_id
      FROM songs
      WHERE song_id IN (${this._questionString(songIds.length)})
    `
    const existSongs = await this._all(sql, songIds)

    if (existSongs.length !== songIds.length) {
      this._logger.writeLog(LOG_BASE.SONG002, { songIds: songIds })
      throw new GameDataValidationError('Song does not exist')
    }
  }

  protected _validateAnimeNames(animeNames: string[]): void {
    for (const animeName of animeNames) {
      if (!animeName || typeof animeName !== 'string') {
        throw new GameDataValidationError('Invalid anime name')
      }
    }
  }
}

export {
  AnimeQuizSongDb
}
