/* global __dirname, module */
/* eslint-disable no-console */

var ExtractTextPlugin = require('extract-text-webpack-plugin'),
	OnBuildPlugin = require('on-build-webpack'),
	exec = require('child_process').exec;

module.exports = [
	{
		context: __dirname + '/app',

		entry: {
			'terra-arcana': './app.jsx',
			html: './index.html',
			login: './styles/login/login.scss'
		},

		output: {
			filename: 'app.js',
			path: __dirname + '/dist'
		},

		module: {
			loaders: [
				{
					test: /\.jsx$/,
					loaders: ['babel-loader', 'eslint-loader'],
					exclude: /node_modules/
				},
				{
					test: /\.html$/,
					loader: 'file?name=[name].[ext]'
				},
				{
					test: /\.scss$/,
					loader: ExtractTextPlugin.extract('css!sass')
				},
				{
					test: /\.(gif|jpe?g|png|svg)$/,
					loader: 'file?name=images/[name].[ext]'
				},
				{
					test: /\.json$/,
					loader: 'json-loader'
				}
			]
		},

		plugins: [
			new ExtractTextPlugin('[name].css', {
				allChunks: true
			} ),

			new OnBuildPlugin(function(stats) { // eslint-disable-line no-unused-vars
				exec(
					'esdoc -c esdoc.json',
					function (error, stdout, stderr) {
						console.log('\nBUILDING DOCUMENTATION\n======================\n' + stdout);

						if (stderr.length > 0) {
							console.log('\nERRORS\n======\n' + stderr);
						}

						if (error !== null) {
							console.log('\nEXEC ERRORS\n===========\n' + error);
						}
					}
				);
			} )
		]
	},

	{
		context: __dirname + '/src/views/zodiac',

		entry: {
			javascript: './zodiac-admin-app.jsx',
			html: './zodiac.html'
		},

		output: {
			filename: 'zodiac.js',
			path: __dirname + '/dist/admin/zodiac'
		},

		module: {
			loaders: [
				{
					test: /\.jsx$/,
					loaders: ['babel-loader', 'eslint-loader'],
					exclude: /node_modules/
				},
				{
					test: /\.html$/,
					loader: 'file?name=[name].[ext]'
				},
				{
					test: /\.scss$/,
					loader: ExtractTextPlugin.extract('css!sass')
				}
			]
		},

		plugins: [
			new ExtractTextPlugin('style.css', {
				allChunks: true
			} )
		]
	}
];
