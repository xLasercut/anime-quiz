/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

import { IAnimeId, IAnimeName } from '.';

export interface ISong {
  anime_id: IAnimeId[];
  anime_name: IAnimeName[];
  artist?: string | null;
  song_id: ISongId;
  song_title: string;
  src: string;
  type: ISongType | 'OP' | 'ED' | 'INSERT';
}

export type ISongId = string;

export interface ISongNew {
  anime_id: IAnimeId[];
  anime_name: any[];
  artist?: string | null;
  song_id: ISongId;
  song_title: string;
  src: string;
  type: ISongType | 'OP' | 'ED' | 'INSERT';
}

export interface ISongRaw {
  anime_id: string;
  anime_name: string;
  artist?: string;
  song_id: ISongId;
  song_title: string;
  src: string;
  type: ISongType | 'OP' | 'ED' | 'INSERT';
}

export interface ISongTitleRaw {
  song_title: string;
}

export type ISongType = 'OP' | 'ED' | 'INSERT';
