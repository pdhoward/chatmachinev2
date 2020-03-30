module.exports = {
    pwa: {
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            swSrc: "src/service-worker.js"
        }
    },
    devServer: {
        open: true,
        port: 3100,
        proxy: 'http://localhost:4000',        
        proxy: {
          '/api*': {
            // Forward frontend dev server request for /api to nodejs dev server
            target: 'http://localhost:4000/'           
          }
        }      

    },
    chainWebpack: config => {
        // remove vue-cli-service's progress output
        config.plugins.delete('progress')        
      }
}