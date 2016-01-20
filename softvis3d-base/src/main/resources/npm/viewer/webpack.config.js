'use strict';

var webpack = require('webpack');
var path = require("path");
var AutoInstallPlugin = require("auto-install-webpack-plugin");

var APP = __dirname;

module.exports = {
    context: APP,
    entry: {
        app: ['webpack/hot/dev-server', './src/index.js']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new AutoInstallPlugin({save: true})
    ],
    /* context, entry, output */
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel!jshint',
                exclude: /node_modules/,
            }
        ]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "softvis3d-base.[name].js",
        library: ["softvis3d-base", "[name]"],
        libraryTarget: "umd"
    }
};