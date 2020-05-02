const fs = require('fs-extra')
const path = require('path')

const distDir = path.join(__dirname, 'dist')

fs.emptyDirSync(distDir)
