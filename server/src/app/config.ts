import * as path from 'path';

class ServerConfig {
  public rootDir: string;
  public logDir: string;
  public dataDir: string;
  public dataBackupDir: string;
  public mainDbPath: string;
  public serverPort: string;
  public serverPassword: string;
  public adminPassword: string;
  public corsConfig: string;
  public clientAuthDelay: number;
  public userDbPath: string;
  public dbBackupSchedule: string;
  public dbBackupCount: number;

  constructor() {
    this.rootDir = path.join(__dirname, '..', '..');
    this.logDir = path.join(this.rootDir, 'log');
    this.dataDir = path.join(this.rootDir, 'data');
    this.dataBackupDir = path.join(this.rootDir, 'data-backup');
    this.mainDbPath = path.join(this.dataDir, 'anime-quiz.db');
    this.userDbPath = path.join(this.dataDir, 'anime-quiz-user.db');
    this.serverPort = process.env.SERVER_PORT || '3000';
    this.serverPassword = process.env.SERVER_PASSWORD || 'server';
    this.adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    this.corsConfig = process.env.CORS_CONFIG || '*';
    this.clientAuthDelay = 2000;
    this.dbBackupSchedule = process.env.DB_BACKUP_SCHEDULE || '0 2 * * *';
    this.dbBackupCount = parseInt(process.env.DB_BACKUP_COUNT || '5');
  }
}

export { ServerConfig };
