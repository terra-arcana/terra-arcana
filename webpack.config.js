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
			filename: '[name].js',
			path: __dirname + '/dist'
		},
		module: {
			loaders: [
				{
					test: /\.jsx$/,
					loaders: ['babel-loader?presets[]=es2015&presets[]=react', 'eslint-loader'],
					exclude: /node_modules/
				},
				{
					test: /\.html$/,
					loader: 'file-loader?name=[name].[ext]'
				},
				{
					test: /\.scss$/,
					loader: ExtractTextPlugin.extract('css-loader!sass-loader')
				},
				{
					test: /\.(gif|jpe?g|png)$/,
					loader: 'file-loader?name=images/[name].[ext]'
				},
				{
					test: /\.svg$/,
					loader: 'svg-inline-loader'
				},
				{
					test: /\.json$/,
					loader: 'json-loader'
				}
			]
		},
		plugins: [
			new ExtractTextPlugin({ filename: '[name].css', allChunks: true })
		],
		devtool: 'source-map'
	},

	// admin:zodiac
	{
		context: __dirname + '/src/views/zodiac',
		entry: {
			zodiac: './zodiac-admin-app.jsx',
			html: './zodiac.html'
		},
		output: {
			filename: '[name].js',
			path: __dirname + '/dist/admin/zodiac'
		},
		module: {
			loaders: [
				{
					test: /\.jsx$/,
					loaders: ['babel-loader?presets[]=es2015&presets[]=react', 'eslint-loader'],
					exclude: /node_modules/
				},
				{
					test: /\.html$/,
					loader: 'file-loader?name=[name].[ext]'
				},
				{
					test: /\.scss$/,
					loader: ExtractTextPlugin.extract('css-loader!sass-loader')
				},
				{
					test: /\.svg$/,
					loader: 'svg-inline-loader'
				}
			]
		},
		plugins: [
			new ExtractTextPlugin({ filename: 'style.css', allChunks: true })
		]
	},

	// admin:xp
	{
		context: __dirname + '/src/views/xp',
		entry: {
			xp: './xp-admin-app.jsx',
			html: './xp.html'
		},
		output: {
			filename: '[name].js',
			path: __dirname + '/dist/admin/xp'
		},
		module: {
			loaders: [
				{
					test: /\.jsx$/,
					loaders: ['babel-loader?presets[]=es2015&presets[]=react', 'eslint-loader'],
					exclude: /node_modules/
				},
				{
					test: /\.html$/,
					loader: 'file-loader?name=[name].[ext]'
				},
				{
					test: /\.scss$/,
					loader: ExtractTextPlugin.extract('css-loader!sass-loader')
				},
				{
					test: /\.svg$/,
					loader: 'svg-inline-loader'
				}
			]
		},
		plugins: [
			new ExtractTextPlugin({ filename: 'style.css', allChunks: true })
		]
	}
];
