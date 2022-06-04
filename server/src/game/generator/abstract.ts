import { AnimeQuizSongDb } from '../../database/song'
import { AnimeQuizUserDb } from '../../database/user'
import { AqGameSettings, AqSong } from '../../shared/interfaces'

class AbstractGameListGenerator {
  protected _songDb: AnimeQuizSongDb
  protected _userDb: AnimeQuizUserDb
  protected _duplicate: boolean
  protected _songCount: number
  protected _users: string[]
  protected _dupeSongIds: Set<string>
  protected _dupeAnimeIds: Set<string>

  constructor(songDb: AnimeQuizSongDb, userDb: AnimeQuizUserDb, settings: AqGameSettings) {
    this._songDb = songDb
    this._userDb = userDb
    this._duplicate = settings.duplicate
    this._songCount = settings.songCount
    this._users = settings.users
    this._dupeSongIds = new Set()
    this._dupeAnimeIds = new Set()
  }

  protected _isDupeAnime(song: AqSong): boolean {
    for (const animeId of song.anime_id) {
      if (this._dupeAnimeIds.has(animeId)) {
        return true
      }
    }
    return false
  }

  protected _addDupeAnimeIds(song: AqSong): void {
    for (const animeId of song.anime_id) {
      this._dupeAnimeIds.add(animeId)
    }
  }

  protected _addDupeSongId(song: AqSong): void {
    this._dupeSongIds.add(song.song_id)
  }

  protected _isDupeSong(song: AqSong): boolean {
    return this._dupeSongIds.has(song.song_id)
  }
}

export {
  AbstractGameListGenerator
}
