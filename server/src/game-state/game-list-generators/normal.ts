import { GameListGenerator } from './common';
import { TSong } from 'anime-quiz-shared-resources/src/models/types';

class NormalGameListGenerator extends GameListGenerator {
  protected _generateList(): TSong[] {
    const songList: TSong[] = [];
    const userSongList = this._getSongsByUserIds(this._players);
    for (const song of userSongList) {
      if (!this._isDupeAnime(song)) {
        songList.push(song);
        this._addDupeAnime(song);
        if (songList.length >= this._songCount) {
          return this._shuffleArray<TSong>(songList);
        }
      }
    }
    return this._shuffleArray<TSong>(songList);
  }
}

export { NormalGameListGenerator };
