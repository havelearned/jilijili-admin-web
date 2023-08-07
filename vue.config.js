const {defineConfig} = require('@vue/cli-service')
const {resolve} = require("path");
module.exports = defineConfig({
    transpileDependencies: [
        'quasar'
    ],
    lintOnSave: false,
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title= '肌理后台'
                return args
            })
    },
    pluginOptions: {
        quasar: {
            importStrategy: 'kebab',
            rtlSupport: true
        },
        'style-resources-loader': {
            preProcessor: 'stylus',
            patterns: [
                resolve(__dirname, '@/assets/css/app.styl')
            ]
        }
    },
    devServer: {
        //代理axios
        proxy: 'http://localhost:8080',
        //vue自己启动的端口
        port: 9111
    }

})
