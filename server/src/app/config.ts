import * as path from 'path';
import { ServerConfig } from '../interfaces';

const ROOT_DIR = path.join(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const PRIMARY_DATA_DIR = path.join(DATA_DIR, 'primary');
const SECONDARY_DATA_DIR = path.join(DATA_DIR, 'secondary');

const SERVER_CONFIG: ServerConfig = {
  rootDir: ROOT_DIR,
  logDir: path.join(ROOT_DIR, 'log'),
  dataDir: DATA_DIR,
  primaryDataDir: PRIMARY_DATA_DIR,
  secondaryDataDir: SECONDARY_DATA_DIR,
  mainDbPath: path.join(PRIMARY_DATA_DIR, 'anime-quiz.db'),
  userDbPath: path.join(SECONDARY_DATA_DIR, 'anime-quiz-user.db'),
  gameDbPath: path.join(SECONDARY_DATA_DIR, 'anime-quiz-game.db'),
  serverPort: process.env.SERVER_PORT || '3000',
  corsConfig: process.env.CORS_CONFIG || '*',
  clientAuthDelay: 2000,
  redirectUrl: process.env.REDIRECT_URL || 'http://localhost:8080/anime-quiz/',
  discordClientId: process.env.DISCORD_CLIENT_ID || '',
  discordClientSecret: process.env.DISCORD_CLIENT_SECRET || '',
  logLevel: process.env.LOG_LEVEL || 'info',
  discordUserOverride: process.env.DISCORD_USER_OVERRIDE || ''
};

export { SERVER_CONFIG };
