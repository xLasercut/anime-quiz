import { GameListGenerator } from './common';
import { TGameRoomSettings, TSong, TUserId } from 'anime-quiz-shared-resources/src/models/types';
import { THandlerDependencies } from '../../interfaces';

class BalancedGameListGenerator extends GameListGenerator {
  protected _songsPerUser: number;

  constructor(dependencies: THandlerDependencies, settings: TGameRoomSettings, players: TUserId[]) {
    super(dependencies, settings, players);
    this._songsPerUser = Math.floor(this._songCount / this._players.length);
  }

  protected _generateList(): TSong[] {
    const songList: TSong[] = [];
    for (const userId of this._players) {
      let songCount = 0;
      for (const song of this._getSongsByUserId(userId)) {
        if (!this._isDupeSong(song) && !this._isDupeAnime(song)) {
          songList.push(song);
          this._addDupeSong(song);
          this._addDupeAnime(song);
          songCount += 1;
        }

        if (songCount >= this._songsPerUser) {
          break;
        }
      }
    }
    return this._shuffleArray<TSong>(songList);
  }
}

export { BalancedGameListGenerator };
