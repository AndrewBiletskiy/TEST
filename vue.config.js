'use strict'
const titles = require('./title.js')
const glob = require('glob')
const pages = {}
const webpack = require('webpack')

glob.sync('./src/pages/**/app.js').forEach(path => {
    const chunk = path.split('./src/pages/')[1].split('/app.js')[0]
    const filename = chunk + '.html'
    pages[chunk] = {
        filename: filename,
        entry: path,
        template: path.replace(/.js/g, '.pug'),
        title: titles[chunk],
        chunks: ['chunk-vendors', 'chunk-common', chunk]
    }
})
const path = require('path')
module.exports = {
    pages,
    css: {
        // enable CSS source maps?
        sourceMap: true
    },
    configureWebpack: {
        resolve: {
            extensions: ['.js'],
            alias: {
                CSS: path.resolve(__dirname, 'src/assets/css/'),
                JS: path.resolve(__dirname, 'src/assets/js/'),
                IMG: path.resolve(__dirname, 'src/assets/img/'),
                PUG: path.resolve(__dirname, 'src/components/pug/'),
                'jquery': 'jquery/dist/jquery.js',
            }
        },
        // plugins: [
        //   new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jquery: 'jquery',
        //     jQuery: 'jquery',
        //     'window.jQuery': 'jquery',
        //     'window.$': 'jquery',
        //   }),
        //   new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        // ]
    },
    chainWebpack: config => {
        // config.plugin('jquery')
        //   .use(webpack.ProvidePlugin, [{
        //     $: 'jquery',
        //     jquery: 'jquery',
        //     jQuery: 'jquery',
        //     'window.jQuery': 'jquery',
        //     'window.$': 'jquery',
        //     'modal': "exports-loader?modal!bootstrap/js/dist/modal"
        // }]);

        config.externals({
            ...config.get('externals'),
            'jquery': 'jQuery',
            'popper': 'Popper'
        });

        config.plugin('define').tap(definitions => {
            definitions[0] = Object.assign(definitions[0], {
                $: 'jquery',
                jquery: 'jquery',
                'window.jQuery': 'jquery',
                'window.$': 'jquery',
                'window.jquery': 'jquery',
                jQuery: 'jquery',
            })
            return definitions
        });

        config.plugins.delete('named-chunks')

        const pugRule = config.module.rule('pug')
        pugRule.uses.clear()

        pugRule
            .use('html-loader')
            .loader('html-loader')
            .options({
                root: path.resolve(__dirname, 'src'),
                attrs: ['img:src', 'link:href']
            });
        pugRule
            .use('pug-plain-loader')
            .loader('pug-plain-loader')

        // config
        //   .plugin('html')
        //   .tap(args => {
        //     return({
        //       minify: {
        //         removeAttributeQuotes: false
        //       }
        //     });
        //   });

    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                pathRewrite: {'^/api': ''}
            }
        }
    }
}