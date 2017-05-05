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
                path: "/app",
                filename: targetFolder + "bundle.js"
            },

            devtool: isProd ? false : "source-map",

            resolve: {
                extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
            },

            module: {
                rules: [
                    { test: /\.tsx?$/, exclude: /(node_modules)/, loader: "babel-loader?presets[]=es2015!ts-loader"  },
                    { test: /\.js$/, exclude: /(node_modules)/, loader: "babel-loader?presets[]=es2015" },
                    { test: /\.js$/, loader: "source-map-loader", enforce: "pre"} // if isProd
                ]
            },

            plugins: isProd ? plugins : [],

            // When importing a module whose path matches one of the following, just
            // assume a corresponding global variable exists and use that instead.
            // This is important because it allows us to avoid bundling all of our
            // dependencies, which allows browsers to cache those libraries between builds.
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
                path: "/app",
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