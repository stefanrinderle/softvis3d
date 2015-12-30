'use strict';
var webpack = require('webpack');
var path = require('path');

var AutoInstallPlugin = require("auto-install-webpack-plugin");

var APP = __dirname + '/app';

module.exports = {
    context: APP,
    entry: {
        app: ['webpack/hot/dev-server', './core/bootstrap.js']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new AutoInstallPlugin({save: true})
    ],
    /* context, entry, output */
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.js$/,
                loader: 'jshint',
                exclude: /node_modules|bower_components/
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: "file-loader?name=img/img-[hash:6].[ext]"
            }
        ]
    },
    output: {
        path: APP,
        filename: 'bundle.js',
        publicPath: "/app/"
    }
};