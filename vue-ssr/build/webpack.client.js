const base = require('./webpack.config.js');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueServerRender = require('vue-server-renderer/client-plugin');

module.exports = merge(base, {
    entry: {
        client1: path.resolve(__dirname, '../src/client-entry.js')
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'client.html',
            template: path.resolve(__dirname, '../public/client.html')
        }),
        new VueServerRender()
    ]
});