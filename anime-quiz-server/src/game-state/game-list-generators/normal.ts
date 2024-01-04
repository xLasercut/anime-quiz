import { GameListGenerator } from './common';
import { SongIdType, SongType } from '../../shared/models/types';

class NormalGameListGenerator extends GameListGenerator {
  protected _generateList(): SongType[] {
    let allSongIds: SongIdType[] = [];
    for (const userId of this._players) {
      const songIds = this._userSongDb.getUserSongList(userId);
      allSongIds = allSongIds.concat(songIds);
    }
    const allSongList = this._songDb.getSongListByIds(Array.from(new Set(allSongIds)));
    const shuffledSongList = this._shuffleSongList(allSongList);
    const songList = [];
    for (const song of shuffledSongList) {
      if (!this._isDupeAnime(song)) {
        songList.push(song);
        this._addDupeAnime(song);
        if (songList.length >= this._songCount) {
          return this._shuffleSongList(songList);
        }
      }
    }
    return this._shuffleSongList(songList);
  }
}

export { NormalGameListGenerator };
