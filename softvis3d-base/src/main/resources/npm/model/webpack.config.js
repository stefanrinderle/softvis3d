'use strict';

var webpack = require('webpack');
var path = require("path");
var babel = 'babel-loader';

var APP = __dirname;

module.exports = {
    context: APP,
    entry: {
        app: ['webpack/hot/dev-server', './src/softvis3dModel.js']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'jshint',
                exclude: [/dist/, /node_modules/]
            },
            {
              test: /src\/.*\.js$/,
              loader: babel,
              query: { presets: ['es2015'] }
            }
        ]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "softvis3d-model.js",
        library: ["softvis3d-model"],
        libraryTarget: "umd"
    }
};