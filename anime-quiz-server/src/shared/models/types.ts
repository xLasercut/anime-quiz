import { z } from 'zod';
import { Avatar, ClientData, NotificationColor, SystemNotification } from './client';
import { Song, SongId, SongTitle, SongType } from './song';
import { Anime, AnimeId, AnimeName } from './anime';

export type ClientDataType = z.infer<typeof ClientData>;
export type NotificationColorType = z.infer<typeof NotificationColor>;
export type SystemNotificationType = z.infer<typeof SystemNotification>;
export type AvatarType = z.infer<typeof Avatar>;
export type SongTypeType = z.infer<typeof SongType>;
export type SongTitleType = z.infer<typeof SongTitle>;
export type AnimeNameType = z.infer<typeof AnimeName>;
export type AnimeIdType = z.infer<typeof AnimeId>;
export type SongType = z.infer<typeof Song>;
export type AnimeType = z.infer<typeof Anime>;
export type SongIdType = z.infer<typeof SongId>;
