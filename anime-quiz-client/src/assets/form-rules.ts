import { ref } from 'vue';
import { Admin, Avatar, DiscordId, DisplayName, UserId } from '@/assets/shared/models/user';

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

const DISCORD_ID_RULES = [
  (v: string): boolean | string => !!v || 'Discord ID required',
  (v: string): boolean | string => isValidDiscordId(v) || 'Invalid Discord ID'
];

const DISPLAY_NAME_RULES = [
  (v: string): boolean | string => !!v || 'Display name required',
  (v: string): boolean | string =>
    isValidDisplayName(v) || 'Display name can only contain: 0-9, A-Z, a-z and space',
  (v: string): boolean | string =>
    (v && v.length <= 20) || 'Display name must be under 20 characters'
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

export { DISCORD_ID_RULES, DISPLAY_NAME_RULES, AVATAR_RULES, USER_ID_RULES, ADMIN_RULES };
