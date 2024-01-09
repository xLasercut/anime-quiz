import { GameListGenerator } from './common';
import { GameRoomSettingsType, SongType, UserIdType } from '../../shared/models/types';
import { HandlerDependencies } from '../../interfaces';

class BalancedPlusGameListGenerator extends GameListGenerator {
  protected _songsPerUser: number;
  protected _normalSongCount: number;

  constructor(dependencies: HandlerDependencies, settings: GameRoomSettingsType, players: UserIdType[]) {
    super(dependencies, settings, players);
    this._normalSongCount = Math.floor(this._songCount / 2);
    this._songsPerUser = Math.floor(this._normalSongCount / this._players.length);
  }

  protected _generateList(): SongType[] {
    return this._shuffleArray<SongType>(this._generateNormalList().concat(this._generateBalancedList()));
  }

  protected _generateNormalList(): SongType[] {
    const songList: SongType[] = [];
    for (const song of this._getSongsByUserIds(this._players)) {
      if (!this._isDupeAnime(song) && !this._isDupeSong(song)) {
        songList.push(song);
        this._addDupeAnime(song);
        this._addDupeSong(song);
        if (songList.length >= this._normalSongCount) {
          return songList;
        }
      }
    }
    return songList;
  }

  protected _generateBalancedList(): SongType[] {
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
    return songList;
  }
}

export { BalancedPlusGameListGenerator };
