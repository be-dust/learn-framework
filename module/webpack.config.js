let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js'
	},
	plugins: [
		new HtmlWebpackPlugin()
	],
	devServer: {
		contentBase: './dist'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	}
}