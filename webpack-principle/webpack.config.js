const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',// 默认模块名是main
    devtool: 'none',// sourcemap
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }   
}