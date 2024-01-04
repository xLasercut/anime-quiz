import { SongType } from '../shared/models/types';

class GameState {
  protected _currentSong: SongType = {
    songId: '',
    src: '',
    type: 'OP',
    songTitle: '',
    artist: '',
    animeName: [],
    animeId: []
  };
  protected _currentSongCount: number = 0;
  protected _maxSongCount: number = 0;
  protected _gameSongList: SongType[] = [];
}

export { GameState };
