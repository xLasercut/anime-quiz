import { IAiqImage } from './database';
import { IBannerColor } from '../types/game';
interface IAiqSettings {
    imageCount: number;
    guessTime: number;
    duplicate: boolean;
    minFactor: number;
    maxFactor: number;
}
interface IAiqGameState {
    currentImage: IAiqImage;
    currentImageCount: number;
    maxImageCount: number;
    playing: boolean;
}
interface IAiqGuess {
    name: string;
    anime: string;
}
interface IAiqPlayer {
    username: string;
    avatar: string;
    score: number;
    admin: boolean;
    host: boolean;
    socketId: string;
    color: IBannerColor;
    guess: IAiqGuess;
}
export { IAiqSettings, IAiqGuess, IAiqGameState, IAiqPlayer };
