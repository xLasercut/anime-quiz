import * as path from 'path';
import { ServerConfig } from '../interfaces';

const ROOT_DIR = path.join(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

const SERVER_CONFIG: ServerConfig = {
  rootDir: ROOT_DIR,
  logDir: path.join(ROOT_DIR, 'log'),
  dataDir: DATA_DIR,
  dataBackupDir: path.join(ROOT_DIR, 'data-backup'),
  mainDbPath: path.join(DATA_DIR, 'anime-quiz.db'),
  userDbPath: path.join(DATA_DIR, 'anime-quiz-user.db'),
  serverPort: process.env.SERVER_PORT || '3000',
  corsConfig: process.env.CORS_CONFIG || '*',
  clientAuthDelay: 2000,
  dbBackupSchedule: process.env.DB_BACKUP_SCHEDULE || '0 2 * * *',
  dbBackupCount: parseInt(process.env.DB_BACKUP_COUNT || '5'),
  redirectUrl: process.env.REDIRECT_URL || 'http://localhost:8080',
  discordClientId: process.env.DISCORD_CLIENT_ID || '',
  discordClientSecret: process.env.DISCORD_CLIENT_SECRET || '',
  logLevel: process.env.LOG_LEVEL || 'info',
  discordUserOverride: process.env.DISCORD_USER_OVERRIDE || ''
};

export { SERVER_CONFIG };
