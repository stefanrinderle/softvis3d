/*
 * softvis3d-frontend
 * Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
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
module.exports = function (env, argv) {
    var webpack = require('webpack'),
        path = require('path'),
        isProd = argv.mode === 'production',
        MiniCssExtractPlugin = require('mini-css-extract-plugin'),
        targetFolder = "static/"

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

            externals: {
                "react": "React",
                "react-dom": "ReactDOM",
                "three": "THREE"
            },

            optimization: {
                minimize: false,
                // minimize does not work because of dependency injection based on class names
                // keep_classnames does not help

                // const TerserPlugin = require("terser-webpack-plugin");
                // minimizer: [new TerserPlugin({
                //     terserOptions: {
                //         keep_classnames: true,
                //     },
                //     parallel: true,
                //     sourceMap: true
                // })],
            },

            devServer: {
                port: 8080,
                open: true,
                contentBase: path.join(__dirname, 'app/'),
                proxy: {
                    '/api': 'http://localhost:9000',
                },
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
            },

            module: {
                rules: [
                    {
                        test: /\.scss$/,
                        use: [MiniCssExtractPlugin.loader, "css-loader", 'sass-loader'],
                    }
                ]
            },

            optimization: {
                splitChunks: {
                    cacheGroups: {
                        styles: {
                            name: 'styles',
                            test: /\.css$/,
                            chunks: 'all',
                            enforce: true,
                        },
                    },
                },
            },

            plugins: [new MiniCssExtractPlugin({
                filename: targetFolder + 'style.css',
            })]
        }
    ];
};