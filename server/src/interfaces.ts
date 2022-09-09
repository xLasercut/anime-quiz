import { ISong } from './shared/interfaces';

interface ILogTemplate {
  reference: string;
  level: string;
  message: string;
}

interface IGameStateRaw {
  playing: boolean;
  currentSongCount: number;
  startPosition: number;
  gameList: ISong[];
  songOverride: ISong | null;
  countdown: NodeJS.Timer;
  timeout: NodeJS.Timeout;
  currentSong: ISong;
}

export { ILogTemplate, IGameStateRaw };
