import { GameListGenerator } from './common';
import { TGameRoomSettings, TSong, TUserId } from 'anime-quiz-shared-resources';
import { THandlerDependencies } from '../../interfaces';

class ShiritoriGameListGenerator extends GameListGenerator {
  protected _firstLetterPattern: RegExp;

  constructor(dependencies: THandlerDependencies, settings: TGameRoomSettings, players: TUserId[]) {
    super(dependencies, settings, players);
    this._firstLetterPattern = new RegExp('[A-Za-z]');
  }

  protected _generateList(): TSong[] {
    const userSongs = this._getSongsByUserIds(this._players);
    if (userSongs.length <= 0) {
      return [];
    }
    const songList: TSong[] = [];
    let lastLetter = '';
    let unmatchCount = 0;
    while (songList.length < this._songCount && unmatchCount < 2) {
      const nextSong = this._findNextSong(userSongs, lastLetter);
      if (nextSong) {
        songList.push(nextSong);
        this._addDupeSong(nextSong);
        this._addDupeAnime(nextSong);
        lastLetter = this._getLastLetter(nextSong.songTitle);
        unmatchCount = 0;
      } else {
        lastLetter = '';
        unmatchCount += 1;
      }
    }
    return songList;
  }

  protected _findNextSong(userSongs: TSong[], lastLetter: string): TSong | null {
    if (lastLetter) {
      return this._findNextSongFromLastLetter(userSongs, lastLetter);
    }
    return this._findNextSongStandard(userSongs);
  }

  protected _findNextSongFromLastLetter(userSongs: TSong[], lastLetter: string): TSong | null {
    for (const song of userSongs) {
      for (const animeName of song.animeName) {
        if (!this._isDupeSong(song) && this._getFirstLetter(animeName) === lastLetter && !this._isDupeAnime(song)) {
          return song;
        }
      }
    }
    return null;
  }

  protected _findNextSongStandard(userSongs: TSong[]): TSong | null {
    for (const song of userSongs) {
      if (!this._isDupeSong(song) && !this._isDupeAnime(song)) {
        return song;
      }
    }
    return null;
  }

  protected _getLastLetter(name: string): string {
    const nameReversed = name.split('').reverse().join('');
    if (this._firstLetterPattern.test(nameReversed)) {
      const matched = nameReversed.match(this._firstLetterPattern) as RegExpMatchArray;
      return matched[0].toLowerCase();
    }

    return '';
  }

  protected _getFirstLetter(name: string): string {
    if (this._firstLetterPattern.test(name)) {
      const matched = name.match(this._firstLetterPattern) as RegExpMatchArray;
      return matched[0].toLowerCase();
    }

    return '';
  }
}

export { ShiritoriGameListGenerator };
