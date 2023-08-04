import { z } from 'zod';
import { Admin, Avatar, DiscordId, DisplayName, UserId } from '@/assets/shared/models/user';
import { AnimeId, AnimeName } from '@/assets/shared/models/anime';
import { SongId, SongSrc, SongTitle, SongType } from '@/assets/shared/models/song';
import { EmojiCommand, EmojiId, EmojiSrc, EmojiType } from '@/assets/shared/models/emoji';

function _canParseValue(v: any, parser: any): boolean {
  try {
    parser.parse(v);
    return true;
  } catch {
    return false;
  }
}

function isValidDiscordId(v: string): boolean {
  return _canParseValue(v, DiscordId);
}

function isValidDisplayName(v: string): boolean {
  return _canParseValue(v, DisplayName);
}

function isValidAvatar(v: string): boolean {
  return _canParseValue(v, Avatar);
}

function isValidUserId(v: string): boolean {
  return _canParseValue(v, UserId);
}

function isValidAdmin(v: boolean): boolean {
  return _canParseValue(v, Admin);
}

function isValidAnimeId(v: string): boolean {
  return _canParseValue(v, AnimeId);
}

function isValidAnimeName(v: string[]): boolean {
  return _canParseValue(v, z.array(AnimeName));
}

function isValidSongId(v: string): boolean {
  return _canParseValue(v, SongId);
}

function isValidSongTitle(v: string): boolean {
  return _canParseValue(v, SongTitle);
}

function isValidSongSource(v: string): boolean {
  return _canParseValue(v, SongSrc);
}

function isValidSongType(v: string): boolean {
  return _canParseValue(v, SongType);
}

function isValidSongAnime(v: string[]): boolean {
  return _canParseValue(v, z.array(AnimeId));
}

function isValidEmojiId(v: string): boolean {
  return _canParseValue(v, EmojiId);
}

function isValidEmojiCommand(v: string): boolean {
  return _canParseValue(v, EmojiCommand);
}

function isValidEmojiSrc(v: string): boolean {
  return _canParseValue(v, EmojiSrc);
}

function isValidEmojiType(v: string): boolean {
  return _canParseValue(v, EmojiType);
}

const DISCORD_ID_RULES = [
  (v: string): boolean | string => !!v || 'Discord ID required',
  (v: string): boolean | string => isValidDiscordId(v) || 'Invalid Discord ID'
];

const DISPLAY_NAME_RULES = [
  (v: string): boolean | string => !!v || 'Display name required',
  (v: string): boolean | string => isValidDisplayName(v) || 'Display name can only contain: 0-9, A-Z, a-z and space',
  (v: string): boolean | string => (v && v.length <= 20) || 'Display name must be under 20 characters'
];

const AVATAR_RULES = [
  (v: string): boolean | string => !!v || 'Avatar required',
  (v: string): boolean | string => isValidAvatar(v) || 'Invalid Avatar'
];

const USER_ID_RULES = [
  (v: string): boolean | string => !!v || 'User ID required',
  (v: string): boolean | string => isValidUserId(v) || 'Invalid User ID'
];

const ADMIN_RULES = [(v: boolean): boolean | string => isValidAdmin(v) || 'Invalid Admin'];

const ANIME_ID_RULES = [
  (v: string): boolean | string => !!v || 'Anime ID required',
  (v: string): boolean | string => isValidAnimeId(v) || 'Invalid Anime ID'
];

const ANIME_NAME_RULES = [
  (v: string[]): boolean | string => v.length > 0 || 'Anime name required',
  (v: string[]): boolean | string => isValidAnimeName(v) || 'Invalid anime name'
];

const SONG_ID_RULES = [
  (v: string): boolean | string => !!v || 'Song ID required',
  (v: string): boolean | string => isValidSongId(v) || 'Invalid Song ID'
];

const SONG_TITLE_RULES = [
  (v: string): boolean | string => !!v || 'Song Title required',
  (v: string): boolean | string => isValidSongTitle(v) || 'Invalid Song Title'
];

const SONG_SRC_RULES = [
  (v: string): boolean | string => !!v || 'Song Source required',
  (v: string): boolean | string => isValidSongSource(v) || 'Invalid Song Source'
];

const SONG_TYPE_RULES = [
  (v: string): boolean | string => !!v || 'Song Type required',
  (v: string): boolean | string => isValidSongType(v) || 'Invalid Type Source'
];

const SONG_ANIME_ID_RULES = [
  (v: string[]): boolean | string => v.length > 0 || 'Anime required',
  (v: string[]): boolean | string => isValidSongAnime(v) || 'Invalid anime'
];

const EMOJI_ID_RULES = [
  (v: string): boolean | string => !!v || 'Emoji ID required',
  (v: string): boolean | string => isValidEmojiId(v) || 'Invalid Emoji ID'
];
const EMOJI_COMMAND_RULES = [
  (v: string): boolean | string => !!v || 'Emoji Command required',
  (v: string): boolean | string => isValidEmojiCommand(v) || 'Invalid Emoji Command'
];
const EMOJI_TYPE_RULES = [
  (v: string): boolean | string => !!v || 'Emoji Type required',
  (v: string): boolean | string => isValidEmojiType(v) || 'Invalid Emoji Type'
];
const EMOJI_SRC_RULES = [
  (v: string): boolean | string => !!v || 'Emoji Source required',
  (v: string): boolean | string => isValidEmojiSrc(v) || 'Invalid Emoji Source'
];

export {
  DISCORD_ID_RULES,
  DISPLAY_NAME_RULES,
  AVATAR_RULES,
  USER_ID_RULES,
  ADMIN_RULES,
  ANIME_ID_RULES,
  ANIME_NAME_RULES,
  SONG_ID_RULES,
  SONG_TITLE_RULES,
  SONG_SRC_RULES,
  SONG_TYPE_RULES,
  SONG_ANIME_ID_RULES,
  EMOJI_ID_RULES,
  EMOJI_COMMAND_RULES,
  EMOJI_TYPE_RULES,
  EMOJI_SRC_RULES
};
