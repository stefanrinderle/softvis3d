'use strict';

var webpack = require('webpack');
var AutoInstallPlugin = require("auto-install-webpack-plugin");

var APP = __dirname;

module.exports = {
    context: APP,
    entry: {
        app: ['webpack/hot/dev-server', './src/scene.js']
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
        path: APP,
        filename: './dist/bundle.js',
        publicPath: "/"
    }
};