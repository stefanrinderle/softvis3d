/*
 * softvis3d-frontend
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
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

module.exports = function (env) {
    env = env || {};
    var webpack = require('webpack'),
        path = require('path'),
        isProd = env.prod,
        ExtractTextPlugin = require('extract-text-webpack-plugin'),
        targetFolder = "static/",
        plugins = [new webpack.optimize.UglifyJsPlugin({ minimize: true, sourceMap: true })],
        proxy = {
            "/api": {
                target: "http://localhost:9000",
                secure: false,
                changeOrigin: true,
                bypass: function(req) {
                    return false;
                }
            }
        };

    return [
        // ######## JS Configuration ########
        // ##################################
        {
            name: "js",

            entry: [
                "core-js/fn/set",
                "core-js/fn/array/index-of",
                "core-js/fn/array/is-array",
                "core-js/fn/array/from",
                "core-js/fn/object/get-own-property-descriptor",
                "core-js/fn/object/get-own-property-descriptors",
                "core-js/fn/object/get-own-property-names",
                "core-js/fn/object/get-own-property-symbols",
                "core-js/fn/promise",
                "./src/index.ts"
            ],
            output: {
                path: path.join(__dirname, "app"),
                filename: targetFolder + "bundle.js"
            },

            devtool: isProd ? false : "source-map",

            resolve: {
                extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
            },

            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        exclude: /(node_modules)/,
                        use: [
                            {
                                loader: "babel-loader",
                                options: {
                                    presets: ["env"]
                                }
                            },
                            {
                                loader: "ts-loader"
                            },
                        ]
                    },
                    {
                        test: /\.js$/,
                        use: ["source-map-loader"],
                        enforce: "pre"
                    }
                ]
            },

            plugins: isProd ? plugins : [],

            externals: {
                "react": "React",
                "react-dom": "ReactDOM",
                "three": "THREE"
            },

            devServer: {
                port: 8080,
                open: true,
                contentBase: "app/",
                proxy: proxy,
                quiet: false
            }
        },


        // ####### SASS Configuration #######
        // ##################################
        {
            name: "css",

            entry: [ "./src/style/index.scss" ],

            output: {
                path: path.join(__dirname, "app"),
                filename: targetFolder + "style.css"
            },

            module: {
                rules: [
                    {
                        test: /\.scss$/,
                        use: ExtractTextPlugin.extract({ use: ["css-loader", "sass-loader"]})
                    }
                ]
            },

            plugins: [
                // Required for creating a separate css file rather than mashing css and js into one horrible file
                new ExtractTextPlugin(targetFolder + "style.css")
            ]
        }
    ];
};