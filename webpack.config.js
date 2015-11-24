var ExtractTextPlugin = require('extract-text-webpack-plugin'),
    OnBuildPlugin = require('on-build-webpack'),
    exec = require('child_process').exec,
    child;

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
                loaders: ["babel-loader", "eslint-loader"],
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: "file?name=[name].[ext]"
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css!sass')
            }
        ],
    },

    plugins: [
        new ExtractTextPlugin('style.css', {
            allChunks: true
        } ),

        new OnBuildPlugin(function(stats) {
            child = exec(
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
};
