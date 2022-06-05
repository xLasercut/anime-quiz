const { defineConfig } = require('@vue/cli-service')

let publicPath = './'

if (process.env.NODE_ENV === 'production') {
  publicPath = '/anime-quiz/'
}

module.exports = defineConfig({
  publicPath: publicPath,
  transpileDependencies: [
    'vuetify'
  ]
})
