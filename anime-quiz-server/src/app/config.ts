import * as path from 'path'

class ServerConfig {
  public rootDir: string
  public logDir: string
  public dataDir: string
  public serverPort: string
  public serverPassword: string
  public adminPassword: string
  public corsConfig: string
  public clientAuthDelay: number

  constructor() {
    this.rootDir = path.join(__dirname, '..', '..')
    this.logDir = path.join(this.rootDir, 'log')
    this.dataDir = path.join(this.rootDir, 'data')
    this.serverPort = process.env.SERVER_PORT || '3000'
    this.serverPassword = process.env.SERVER_PASSWORD || 'server'
    this.adminPassword = process.env.ADMIN_PASSWORD || 'admin'
    this.corsConfig = process.env.CORS_CONFIG || '*'
    this.clientAuthDelay = 2000
  }
}

export {
  ServerConfig
}
