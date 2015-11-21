var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: __dirname + "/app",

    entry: {
        javascript: "./app.jsx",
        html: "./index.html"
    },

    output: {
        filename: "app.js",
        path: __dirname + "/dist",
    },

    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loaders: ["babel-loader"],
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: "file?name=[name].[ext]"
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css!sass')
            },
            {
                test: /\.js$/, 
                loader: "eslint-loader", 
                exclude: /node_modules/
            }
        ],
    },

    plugins: [
        new ExtractTextPlugin('style.css', {
            allChunks: true
        } )
    ]
};
