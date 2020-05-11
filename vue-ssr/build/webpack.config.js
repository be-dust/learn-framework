// 默认打包就会找这个文件
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
    mode: 'development',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [
            {
                test: /\.js/,
                use: {
                    loader: 'babel-loader',// 默认会调用@babel/core
                    options: {// 使用babel-loader需要加载那些loader
                        presets: ['@babel/preset-env']// 预设是插件的集合
                    }
                }
            },
            {
                test: /\.vue/,
                use: 'vue-loader'// 默认调用vue-template-compiler
            },
            {
                test: /\.css/,
                use: ['vue-style-loader', 'css-loader']// css提取出来然后插入到style标签中
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}