import { GameListGenerator } from './common';
import { UserSongDb } from '../../database/user-song';
import { SongDb } from '../../database/song';
import { GameRoomSettingsType, SongType, UserIdType } from '../../shared/models/types';

class BalancedGameListGenerator extends GameListGenerator {
  protected _songsPerUser: number;

  constructor(userSongDb: UserSongDb, songDb: SongDb, settings: GameRoomSettingsType, players: UserIdType[]) {
    super(userSongDb, songDb, settings, players);
    this._songsPerUser = Math.floor(this._songCount / this._players.length);
  }

  protected _generateList(): SongType[] {
    const songList = [];
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
    return this._shuffleSongList(songList);
  }
}

export { BalancedGameListGenerator };
