const fs = require('fs')
const path = require('path')

const region = process.env.NGROK_REGION || 'eu'
const token = process.env.NGROK_TOKEN

var config = [
  'web_addr: 0.0.0.0:4040',
  `region: ${region}`
]

if (token) {
  config.push(`authtoken: ${token}`)
}

const filepath = path.join(__dirname, 'ngrok.yml')

fs.writeFileSync(filepath, config.join('\n'))
