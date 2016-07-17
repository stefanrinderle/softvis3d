/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2015 Stefan Rinderle
 * stefan@rinderle.info
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
'use strict';
var webpack = require('webpack');
var path = require('path');

var APP = __dirname + '/static/threeViewer';
var STATIC = __dirname + '/static';

module.exports = {
    context: STATIC,
    entry: {
        bundle: './threeViewer/core/bootstrap.js',
        vendor: ["jquery", "three", "three-orbit-controls", "angular"],
        react: './react/index.tsx'
    },
    // plugins: [
    //     new webpack.optimize.CommonsChunkPlugin({name: "vendor", filename:"vendor.js", minChunks: Infinity})
    // ],

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js", "css", "png", "jpg", "gif"]
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.js$/,
                loader: 'jshint',
                exclude: ["static/threeViewer/bundle.js", "static/threeViewer/vendor.js", /node_modules/, /dist/, /react/]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: { presets: ['es2015'], compact: false }
            },
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: "file-loader?name=img/img-[hash:6].[ext]"
            }
        ],
        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },
    output: {
      path: APP,
      filename: "[name].js",
      publicPath: "/app/"
    }
};