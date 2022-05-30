import { ServerConfig } from '../src/app/config'
import { Database } from 'sqlite3'
import * as readline from 'readline'
import { v4 } from 'uuid'

const config = new ServerConfig()
const db = new Database(config.userDbPath)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Enter username: ', (username) => {
  console.log(`Creating new user ${username}`)
  db.run(`INSERT INTO users (user_id,username) VALUES (?,?)`, [ `user-${v4()}`, username ], (err) => {
    if (err) {
      throw err
    }
    rl.close()
  })
})

rl.on('close', () => {
  db.close()
  process.exit(0)
})

