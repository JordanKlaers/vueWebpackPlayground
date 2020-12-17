const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

function resolve (dir) {
	return path.join(__dirname, './', dir)
}

module.exports = {
	entry: {
		app: './src/main.js',
	},
	devtool: 'inline-source-map',
	devServer: {
		port: 9001,
	},
	resolve: {
		extensions: ['.js', '.vue', '.json', '.scss'],
		alias: {
			'src': resolve('src'),
			'_scss_': resolve('./src/assets/scss'),
			'_images_': resolve('./src/assets/image/')
		}
	},
	// optimization: {
	// 	minimizer: [new TerserPlugin()],
	// 	runtimeChunk: 'single',
	// 	usedExports: true,
	// 	splitChunks: {
	// 		chunks: 'all',
	// 		cacheGroups: {
	// 			lodash: {
	// 				test: /[\\/]node_modules[\\/](lodash-es)[\\/]/,
	// 				name: 'lodash',
	// 				chunks: 'all',
	// 				priority: 2
	// 			},
	// 			node: {
	// 				test: /[\\/]node_modules[\\/]/,
	// 				name: 'node',
	// 				chunks: 'all'
	// 			}
	// 		}
	// 	}
	// },
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					"style-loader", // creates style nodes from JS strings
					"css-loader", // translates CSS into CommonJS
					"sass-loader" // compiles Sass to CSS
				]
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i, 
				loader: "file-loader"
			}
		]
	},
	mode: "development",
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Output Management',
			template: 'src/index.html'
		}),
		new HtmlWebpackHarddiskPlugin(),
		// new UglifyJsPlugin(),
		// new TerserPlugin(),
		// new webpack.optimize.ModuleConcatenationPlugin()
	],
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist/'),
		publicPath: '/'
	}
};