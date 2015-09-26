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
        exclude: /node_modules/,
        loaders: ["babel-loader"],
    },
    {
        test: /\.html$/,
        loader: "file?name=[name].[ext]",
    },
    ],
  },
};
