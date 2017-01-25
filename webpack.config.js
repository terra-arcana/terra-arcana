/* global __dirname, module */

var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
					loaders: ['babel?presets[]=es2015&presets[]=react', 'eslint'],
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
					test: /\.(gif|jpe?g|png)$/,
					loader: 'file?name=images/[name].[ext]'
				},
				{
					test: /\.svg$/,
					loader: 'svg-inline'
				},
				{
					test: /\.json$/,
					loader: 'json'
				}
			]
		},
		plugins: [
			new ExtractTextPlugin('[name].css', {
				allChunks: true
			} )
		],
		devtool: 'source-map'
	},

	// admin:zodiac
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
					loaders: ['babel?presets[]=es2015&presets[]=react', 'eslint'],
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
					test: /\.svg$/,
					loader: 'svg-inline'
				}
			]
		},
		plugins: [
			new ExtractTextPlugin('style.css', {
				allChunks: true
			} )
		]
	},

	// admin:xp
	{
		context: __dirname + '/src/views/xp',
		entry: {
			javascript: './xp-admin-app.jsx',
			html: './xp.html'
		},
		output: {
			filename: 'xp.js',
			path: __dirname + '/dist/admin/xp'
		},
		module: {
			loaders: [
				{
					test: /\.jsx$/,
					loaders: ['babel?presets[]=es2015&presets[]=react', 'eslint'],
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
					test: /\.svg$/,
					loader: 'svg-inline'
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
