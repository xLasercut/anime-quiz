import { AbstractGameListGenerator } from './abstract';
import { IGameSettings, ISong } from '../../shared/interfaces';
import { SongDb } from '../../database/song';
import { UserDb } from '../../database/user';

class NormalGameListGenerator extends AbstractGameListGenerator {
  constructor(songDb: SongDb, userDb: UserDb, settings: IGameSettings) {
    super(songDb, userDb, settings, true);
  }

  protected _generateList(): ISong[] {
    const userSongIds = this._userDb.getSelectedUserSongIds(this._users);
    const userSongs = this._songDb.getSelectedUserSongs(userSongIds);
    const songList = [];
    for (const song of userSongs) {
      if (!this._isDupeAnime(song)) {
        songList.push(song);
        this._addDupeAnimeIds(song);
        if (songList.length >= this._songCount) {
          return songList;
        }
      }
    }
    return songList;
  }
}

export { NormalGameListGenerator };
