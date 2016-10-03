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
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
    // ######## JS Configuration ########
    // ##################################
    {
        name: "js",
        entry: [ "./src/index.tsx" ],
        output: {
            path: "app/",
            filename: "static/bundle.js"
        },

        devtool: "source-map",

        resolve: {
            extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
        },

        module: {
            loaders: [
                { test: /\.tsx?$/, loader: "ts-loader" }
            ],

            preLoaders: [
                { test: /\.js$/, loader: "source-map-loader" }
            ]
        },

        // When importing a module whose path matches one of the following, just
        // assume a corresponding global variable exists and use that instead.
        // This is important because it allows us to avoid bundling all of our
        // dependencies, which allows browsers to cache those libraries between builds.
        externals: {
            "react": "React",
            "react-dom": "ReactDOM",
            "jquery": "JQuery",
            "three": "three"
        },
        devServer: {
            port: 8080,
            open: true,
            colors: true,
            contentBase: "app/"
        }
    },


    // ####### SASS Configuration #######
    // ##################################
    {
        name: "css",
        entry: [ "./src/styles/index.scss" ],
        output: {
            path: "app/",
            filename: "static/style.css"
        },
        module: {
            loaders: [
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract('css!sass')
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin('static/style.css')
        ]
    }
];
