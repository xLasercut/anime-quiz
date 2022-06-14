import { AbstractDb } from './abstract'
import { ServerConfig } from '../app/config'
import { Logger } from '../app/logging/logger'
import { AqAnime, AqSong } from '../shared/interfaces'
import { AqAnimeRaw, AqSongRaw } from '../interfaces'
import { LOG_BASE } from '../app/logging/log-base'
import { GameDataValidationError } from '../app/exceptions'
import { v4 } from 'uuid'
import { SongValidator } from '../validator/song'
import { shuffleSongList } from '../shared/helpers'

class AnimeQuizSongDb extends AbstractDb {
  protected _animeListCache: AqAnime[]
  protected _songTitleListCache: string[]
  protected _songListCache: AqSong[]
  protected _validator: SongValidator

  constructor(config: ServerConfig, logger: Logger) {
    super(logger, config.mainDbPath)
    this._validator = new SongValidator()
    this.reloadCache()
  }

  public reloadCache(): void {
    this._songTitleListCache = this._getSongTitleList()
    this._animeListCache = this._getAnimeList()
    this._songListCache = this._getSongList()
  }

  public getSongTitleList(): string[] {
    return this._songTitleListCache
  }

  public getAnimeList(): AqAnime[] {
    return this._animeListCache
  }

  public getSongList(): AqSong[] {
    return this._songListCache
  }

  public newSong(song: AqSong): void {
    this._validator.validateSong(song)
    const songId = `song-${v4()}`
    this._addSong(songId, song)
    this._addSongAnime(songId, song.anime_id)
    this.reloadCache()
  }

  public editSong(song: AqSong): void {
    this._validator.validateSong(song)
    this._editSong(song.song_id, song)
    this._deleteSongAnime(song.song_id)
    this._addSongAnime(song.song_id, song.anime_id)
    this.reloadCache()
  }

  public deleteSong(song: AqSong): void {
    this._deleteSong(song.song_id)
    this._deleteSongAnime(song.song_id)
    this.reloadCache()
  }

  public newAnime(anime: AqAnime): void {
    this._validateAnimeNames(anime.anime_name)
    const animeId = `anime-${v4()}`
    this._addAnime(animeId, anime.anime_name)
    this.reloadCache()
  }

  public editAnime(anime: AqAnime): void {
    this._validateAnimeNames(anime.anime_name)
    this._deleteAnime(anime.anime_id)
    this._addAnime(anime.anime_id, anime.anime_name)
    this.reloadCache()
  }

  public deleteAnime(anime: AqAnime): void {
    this._deleteAnime(anime.anime_id)
    this.reloadCache()
  }

  public validateAnimeExist(animeIds: string[]): void {
    const sql = `
      SELECT
        *
      FROM animes
      WHERE animes.anime_id IN (${this._questionString(animeIds.length)})
    `

    const existAnimes = this._db.prepare(sql).all(animeIds)
    if (existAnimes.length < animeIds.length) {
      this._logger.writeLog(LOG_BASE.SONG_DATA_VALIDATION_FAILURE, { animeIds: animeIds })
      throw new GameDataValidationError('Anime does not exist')
    }
  }

  public validateSongsExist(songIds: string[]): void {
    const sql = `
      SELECT
        song_id
      FROM songs
      WHERE song_id IN (${this._questionString(songIds.length)})
    `
    const existSongs = this._db.prepare(sql).all(songIds)

    if (existSongs.length !== songIds.length) {
      this._logger.writeLog(LOG_BASE.SONG_DATA_VALIDATION_FAILURE, { songIds: songIds })
      throw new GameDataValidationError('Song does not exist')
    }
  }

  protected _deleteAnime(animeId: string): void {
    const sql = `DELETE FROM animes WHERE anime_id = ?`
    this._db.prepare(sql).run([animeId])
  }

  protected _addAnime(animeId: string, animeNames: string[]): void {
    const sql = `INSERT INTO animes (anime_id, anime_name) VALUES (?,?)`
    const insert = this._db.prepare(sql)
    const insertAll = this._db.transaction((_animeNames: string[]) => {
      for (const animeName of _animeNames) {
        insert.run([animeId, this._sanitizeString(animeName)])
      }
    })
    insertAll(animeNames)
  }

  protected _editSong(songId: string, song: AqSong): void {
    const sql = `
      UPDATE songs
      SET 
        song_title = ?,
        src = ?,
        artist = ?,
        type = ?
      WHERE song_id = ?
    `
    this._db
      .prepare(sql)
      .run([
        this._sanitizeString(song.song_title),
        this._sanitizeString(song.src),
        this._sanitizeString(song.artist),
        this._sanitizeString(song.type),
        songId
      ])
  }

  protected _deleteSong(songId: string): void {
    const sql = `DELETE FROM songs WHERE song_id = ?`
    this._db.prepare(sql).run([songId])
  }

  protected _deleteSongAnime(songId: string): void {
    const sql = `DELETE FROM song_animes WHERE song_id = ?`
    this._db.prepare(sql).run([songId])
  }

  protected _addSong(songId: string, song: AqSong): void {
    const sql = `
      INSERT INTO songs 
        (song_id, song_title, src, artist, type) 
      VALUES 
        (?,?,?,?,?)
    `
    this._db
      .prepare(sql)
      .run([
        songId,
        this._sanitizeString(song.song_title),
        this._sanitizeString(song.src),
        this._sanitizeString(song.artist),
        this._sanitizeString(song.type)
      ])
  }

  protected _addSongAnime(songId: string, animeIds: string[]): void {
    const sql = `INSERT INTO song_animes (song_id, anime_id) VALUES (?,?)`
    const insert = this._db.prepare(sql)
    const insertMany = this._db.transaction((_animeIds: string[]) => {
      for (const animeId of _animeIds) {
        insert.run([songId, animeId])
      }
    })
    insertMany(animeIds)
  }

  protected _validateAnimeNames(animeNames: string[]): void {
    for (const animeName of animeNames) {
      if (!animeName || typeof animeName !== 'string') {
        throw new GameDataValidationError('Invalid anime name')
      }
    }
  }

  protected _getSongTitleList(): string[] {
    const sql = `
      SELECT DISTINCT
        song_title
      FROM songs
    `
    const songList: AqSongRaw[] = this._db.prepare(sql).all()
    return songList.map((song) => {
      return song.song_title
    })
  }

  protected _getAnimeList(): AqAnime[] {
    const sql = `
      SELECT
        anime_id,
        json_group_array(anime_name) as anime_name
      FROM animes
      GROUP BY anime_id
    `
    const animeList: AqAnimeRaw[] = this._db.prepare(sql).all()

    return animeList.map((anime) => {
      return {
        anime_id: anime.anime_id,
        anime_name: JSON.parse(anime.anime_name)
      }
    })
  }

  protected _getSongList(): AqSong[] {
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
      GROUP BY songs.song_id
    `
    const songList: AqSongRaw[] = this._db.prepare(sql).all()

    return songList.map((row) => {
      const { anime_name, song_title, anime_id, artist, ...rest } = row
      return {
        anime_name: JSON.parse(anime_name),
        song_title: song_title || '',
        artist: artist || '',
        anime_id: Array.from(new Set(JSON.parse(anime_id))),
        ...rest
      }
    })
  }

  public getSelectedUserSongs(songIds: string[]): AqSong[] {
    return shuffleSongList(
      this._songListCache.filter((song) => {
        return songIds.includes(song.song_id)
      })
    )
  }
}

export { AnimeQuizSongDb }
