/* global module */

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(config) {
	config.set({
		browsers: ['Chrome'],
		singleRun: true,
		frameworks: ['mocha'],
		files: [
			'webpack.tests.js'
		],
		preprocessors: {
			'webpack.tests.js': ['webpack']
		},
		reporters: ['dots'],
		webpack: {
			module: {
				loaders: [
					{test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader'},
					{test: /\.scss$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract('css!sass')}
				]
			},
			plugins: [
				new ExtractTextPlugin('style.css', {
					allChunks: true
				})
			],
			watch: true
		},
		scssPreprocessor: {
			options: {
				sourceMap: true,
				includePaths: [
					'node_modules'
				]
			}
		},
		webpackServer: {
			noInfo: true
		}
	});
};
