'use strict';

// TODO
var REFACTORING_IN_PROGRESS = true;

var minimize = process.argv.indexOf('--minimize') !== -1;

var webpack = require('webpack');
var path    = require("path");
var plugins = [];
var entries = {};

if (REFACTORING_IN_PROGRESS) {
    entries['index'] = './index.js';
} else {
    entries['model'] = './model/index.js';
    entries['viewer'] = './viewer/index.js';
}

if (minimize && !REFACTORING_IN_PROGRESS) {
    entries['vendor'] = ['jquery', 'three', 'three-orbit-controls'];
    plugins.push(new webpack.optimize.CommonsChunkPlugin({name: "vendor", filename:"vendor.js", minChunks: Infinity}));
    plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
}

module.exports = {
    context: path.join(__dirname, 'src'),
    entry: entries,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: "umd"
    },
    plugins: plugins,
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [/dist/, /node_modules/],
                loader: 'jshint'
            }
            /* TODO: REFACTORING_IN_PROGRESS
            {
                test: /\.js$/,
                exclude: [/dist/, /node_modules/],
                loader: 'babel',
                query: { presets: ['es2015'] }
            }
            */
        ]
    },
    externals: {
        // require("jquery") is external and available on the global var jQuery
        "jquery": "jQuery",
        "three": "THREE",
        'three-orbit-controls': 'three-orbit-controls'
    }
};