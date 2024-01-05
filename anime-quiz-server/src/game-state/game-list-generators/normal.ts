import { GameListGenerator } from './common';
import { SongType } from '../../shared/models/types';

class NormalGameListGenerator extends GameListGenerator {
  protected _generateList(): SongType[] {
    const songList = [];
    for (const song of this._getSongsByUserIds(this._players)) {
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
