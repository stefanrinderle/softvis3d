'use strict';

var webpack = require('webpack');
var path = require("path");

var APP = __dirname;

module.exports = {
    context: APP,
    entry: {
        app: ['webpack/hot/dev-server', './src/index.js']
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
            }
        ]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "softvis3d-base.js",
        library: ["softvis3d-base"],
        libraryTarget: "umd"
    },
    externals: {
        // require("jquery") is external and available on the global var jQuery
        "jquery": "jQuery",
        "three": "THREE"
    }
};