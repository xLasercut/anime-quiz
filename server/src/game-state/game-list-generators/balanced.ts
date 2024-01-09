import { GameListGenerator } from './common';
import { GameRoomSettingsType, SongType, UserIdType } from '../../shared/models/types';
import { HandlerDependencies } from '../../interfaces';

class BalancedGameListGenerator extends GameListGenerator {
  protected _songsPerUser: number;

  constructor(dependencies: HandlerDependencies, settings: GameRoomSettingsType, players: UserIdType[]) {
    super(dependencies, settings, players);
    this._songsPerUser = Math.floor(this._songCount / this._players.length);
  }

  protected _generateList(): SongType[] {
    const songList: SongType[] = [];
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
    return this._shuffleArray<SongType>(songList);
  }
}

export { BalancedGameListGenerator };
