const { defineConfig } = require('@vue/cli-service')
const isPro = process.env.NODE_ENV === 'master' || process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'state'

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: isPro ? '/warehouseManagement/' : '/',
  devServer: {
    port: 5004,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  chainWebpack: (config) => {
    config.output.filename('assets/js/[name].[hash].js').chunkFilename('assets/js/[name].[hash].js').end()
  },
})
