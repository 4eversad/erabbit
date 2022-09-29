const path = require('path')

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({

  transpileDependencies: true,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      // 那些文件需要引入,绝对路径
      patterns: [
        path.join(__dirname, './src/assets/styles/mixins.less'),
        path.join(__dirname, './src/assets/styles/variables.less')
      ]
    },
  },
  chainWebpack: config => {
    // 图片加载
    /*     config.module
          .rule('images')
          .use('url-loader')
          .loader('url-loader')
          .tap(options => ({ ...options, limit: 10000 })) */
    // 开启IP访问权限
    // config.devServer.disableHostCheck(true)
  },

  devServer: {
    allowedHosts: "all",
  },
  configureWebpack: {
    externals: {
      qc: 'QC',
    }
  }

})
