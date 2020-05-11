const base = require('./webpack.config.js');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueServerRender = require('vue-server-renderer/server-plugin');

module.exports = merge(base, {
    entry: {
        server: path.resolve(__dirname, '../src/server-entry.js')
    },
    target: 'node', // 输出的文件是给node来使用的, let fs = require('fs')， 这种情况下就不需要打包node自带的模块
    output: {
        libraryTarget: 'commonjs2'// 入口打包之后的结果: module.exports = 入口的那个函数
    }, 
    plugins: [
        new VueServerRender(),// 需要放在HtmlWebpackPlugin上面
        new HtmlWebpackPlugin({
            filename: 'server.html',
            template: path.resolve(__dirname, '../public/server.html'),
            excludeChunks: ['server']// 排除哪些代码块, 服务端打包之后的server.js不需要引入到server.html中，因此要排除掉
        })
    ]
});