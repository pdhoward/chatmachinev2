module.exports = {
    pwa: {
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            swSrc: "src/service-worker.js"
        }
    },
    devServer: {
        open: true,
        port: 3000,
        proxy: 'http://localhost:3100',
        proxy: {
          '/api*': {
            // Forward frontend dev server request for /api to nodejs dev server
            // target: 'http://localhost:8000/',  // This one works as wel since 127.0.0.1 == localhost for me.
            target: 'http://localhost:3100/',  // <- django's default
          }
        }      

    },
    chainWebpack: config => {
        // remove vue-cli-service's progress output
        config.plugins.delete('progress')
        // optionally replace with another progress output plugin
        // `npm i -D simple-progress-webpack-plugin` to use
        /*
        config.plugin('simple-progress-webpack-plugin').use(require.resolve('simple-progress-webpack-plugin'), [
          {
            format: 'minimal', // options are minimal, compact, expanded, verbose
          },
        ])
        */
      }
}