import { GameStoreState, RootStoreState } from '../../assets/interfaces';
import { Module } from 'vuex';
import { MUTATIONS } from './mutations';
import { IGamePlayer, IGameState } from '../../assets/shared/interfaces';

const DEFAULT_STATE: GameStoreState = {
  players: [],
  currentSong: {
    song_id: '',
    anime_id: [],
    anime_name: [],
    song_title: '',
    artist: '',
    src: '',
    type: 'OP'
  },
  currentSongCount: 0,
  maxSongCount: 0,
  playing: false,
  disableSettings: false
};

const game: Module<GameStoreState, RootStoreState> = {
  state: Object.assign({}, DEFAULT_STATE),
  mutations: {
    [MUTATIONS.SOCKET_UPDATE_GAME_PLAYERS]: (state: GameStoreState, players: IGamePlayer[]) => {
      state.players = players;
    },
    [MUTATIONS.SOCKET_UPDATE_GAME_STATE]: (state: GameStoreState, gameState: IGameState) => {
      state.currentSong = gameState.currentSong;
      state.playing = gameState.playing;
      state.maxSongCount = gameState.maxSongCount;
      state.currentSongCount = gameState.currentSongCount;
    },
    [MUTATIONS.RESET_STORE_STATE]: (state: GameStoreState) => {
      Object.assign(state, DEFAULT_STATE);
    },
    [MUTATIONS.EDIT_DISABLE_GAME_SETTINGS]: (state: GameStoreState, disabled: boolean) => {
      state.disableSettings = disabled;
    }
  }
};

export { game };
