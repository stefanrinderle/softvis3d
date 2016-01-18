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

var AutoInstallPlugin = require("auto-install-webpack-plugin");

var APP = __dirname + '/static/threeViewer';

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
                //loader: 'jshint!babel',
                loader: 'babel',
                exclude: /node_modules/,
                //query: {
                //    presets: ['es2015']
                //}
            },
            //{
            //    test: /\.js$/,
            //    loader: 'ng-annotate!jshint',
            //    exclude: /node_modules/,
            //},
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