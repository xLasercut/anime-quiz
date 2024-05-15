import { z } from 'zod';
import { GAME_DB_PATH, LOG_DIR, MAIN_DB_PATH, USER_DB_PATH } from '../app/constants';

function OptionalString(defaultValue: string) {
  return z.string().trim().min(1).optional().default(defaultValue);
}

function OptionalNumber(defaultValue: number) {
  return z.number().optional().default(defaultValue);
}

const MandatoryString = z.string().min(1);

const ServerConfig = z.object({
  logDir: OptionalString(LOG_DIR),
  mainDbPath: OptionalString(MAIN_DB_PATH),
  userDbPath: OptionalString(USER_DB_PATH),
  gameDbPath: OptionalString(GAME_DB_PATH),
  serverPort: OptionalString('3000'),
  corsConfig: OptionalString('*'),
  clientAuthDelay: OptionalNumber(2000),
  redirectUrl: OptionalString('http://localhost:8080/login'),
  discordClientId: MandatoryString,
  discordClientSecret: MandatoryString,
  logLevel: OptionalString('debug'),
  discordUserOverride: z.string().trim().optional().default(''),
  serverVersion: OptionalString(process.env.SERVER_VERSION || 'dev')
});

export { ServerConfig };
