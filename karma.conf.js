/* global module */

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(config) {
	config.set({
		browsers: ['Chrome'],
		singleRun: true,
		frameworks: ['mocha'],
		files: [
			'node_modules/jquery/dist/jquery.min.js',
			'webpack.tests.js'
		],
		preprocessors: {
			'webpack.tests.js': ['webpack']
		},
		reporters: ['dots', 'junit'],
		webpack: {
			module: {
				loaders: [
					{test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react'},
					{test: /\.scss$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract('css-loader!sass-loader')},
					{test: /\.(gif|jpe?g|png)$/, exclude: /node_modules/, loader: 'file-loader?name=images/[name].[ext]'},
					{test: /\.svg$/, exclude: /node_modules/, loader: 'svg-inline-loader'}
				]
			},
			plugins: [
				new ExtractTextPlugin({ filename: 'style.css', allChunks: true })
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
		},
		junitReporter: {
			outputDir: 'build-reports',
			outputFile: undefined,
			suite: '',
			useBrowserName: true
		}
	});
};
