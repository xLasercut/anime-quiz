import { AbstractGameListGenerator } from './abstract'
import { AqGameSettings, AqSong } from '../../shared/interfaces'
import { AnimeQuizSongDb } from '../../database/song'
import { AnimeQuizUserDb } from '../../database/user'

class NormalGameListGenerator extends AbstractGameListGenerator {
  constructor(songDb: AnimeQuizSongDb, userDb: AnimeQuizUserDb, settings: AqGameSettings) {
    super(songDb, userDb, settings, true)
  }

  protected _generateList(): AqSong[] {
    const userSongIds = this._userDb.getSelectedUserSongIds(this._users)
    const userSongs = this._songDb.getSelectedUserSongs(userSongIds)
    const songList = []
    for (const song of userSongs) {
      if (!this._isDupeAnime(song)) {
        songList.push(song)
        this._addDupeAnimeIds(song)
        if (songList.length >= this._songCount) {
          return songList
        }
      }
    }
    return songList
  }
}

export { NormalGameListGenerator }
