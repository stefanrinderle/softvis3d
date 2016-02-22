'use strict';

var webpack = require('webpack');
var path = require('path');

var APP = path.resolve(__dirname, "app");

module.exports = {
    context: APP,
    entry: {
        app: ['webpack/hot/dev-server', './core/bootstrap.js'],
        vendor: ["jquery", "three"]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
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
                exclude: ["app/bundle.js", "app/vendor.js", /node_modules/, /dist/]
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