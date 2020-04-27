let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js'
	},
	devtool: 'source-map',
	// 更改解析模块的查找方式, 默认找node_modules
	resolve: {
		modules: [path.resolve(__dirname, 'source'), path.resolve('node_modules')]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'public/index.html')
		})
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