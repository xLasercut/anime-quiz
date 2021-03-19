const fs = require('fs')
const path = require('path')
const mustache = require('mustache')

const valuesToTemplate = {
  authtoken: process.env.NGROK_TOKEN,
  region: process.env.NGROK_REGION || 'eu',
  serverAddr: process.env.server
}

let templateString = fs.readFileSync(path.join(__dirname, 'ngrok.yml.template'), 'utf-8')

fs.writeFileSync(path.join(__dirname, 'ngrok.yml'), mustache.render(templateString, valuesToTemplate))
