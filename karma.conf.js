/* global module */

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(config) {
	config.set({
		browsers: ['Chrome'],
		customLaunchers: {
      Chrome_without_sandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox'] // with sandbox it fails under Docker
      }
    },
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
					{test: /\.jsx$/, exclude: /node_modules/, loader: 'babel?presets[]=es2015&presets[]=react'},
					{test: /\.scss$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract('css!sass')},
					{test: /\.(gif|jpe?g|png)$/, exclude: /node_modules/, loader: 'file?name=images/[name].[ext]'},
					{test: /\.svg$/, exclude: /node_modules/, loader: 'svg-inline'}
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
		},
		junitReporter: {
			outputDir: 'build-reports',
			outputFile: undefined,
			suite: '',
			useBrowserName: true
		}
	});
};
