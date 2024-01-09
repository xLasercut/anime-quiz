import { GameListGenerator } from './common';
import { SongType } from '../../shared/models/types';

class NormalGameListGenerator extends GameListGenerator {
  protected _generateList(): SongType[] {
    const songList: SongType[] = [];
    const userSongList = this._getSongsByUserIds(this._players);
    for (const song of userSongList) {
      if (!this._isDupeAnime(song)) {
        songList.push(song);
        this._addDupeAnime(song);
        if (songList.length >= this._songCount) {
          return this._shuffleArray<SongType>(songList);
        }
      }
    }
    return this._shuffleArray<SongType>(songList);
  }
}

export { NormalGameListGenerator };
