/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

import { ISongId } from '.';

export interface IUserSongs {
  song_id: ISongId[];
  user_id: string;
  username: string;
}

export interface IUserSongsRaw {
  song_id: string;
  user_id: string;
  username: string;
}