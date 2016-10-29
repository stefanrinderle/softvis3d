require('ts-node/register');
var webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    tsnode = require('ts-node'),
    path = require('path'),
    isProd = process.argv.indexOf('--prod') !== -1,
    targetFolder = "static/";

var configFile = path.resolve(!isProd && tsnode.fileExists("./config/dev.ts") ? "./config/dev.ts" : "./config/default.ts"),
    plugins = isProd ? [new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, minimize: true, sourceMap: true })] : [],
    appConfig = require(configFile).default,
    proxy = {};

if (appConfig.proxy) {
    proxy[appConfig.api] = { target: appConfig.proxy, secure: false };
}

module.exports = [
    // ######## JS Configuration ########
    // ##################################
    {
        name: "js",
        entry: [ "./src/index.ts" ],
        output: {
            path: "app/",
            filename: targetFolder + "bundle.js"
        },

        devtool: isProd ? null : "source-map",

        resolve: {
            extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
            alias: {
                config: configFile
            }
        },

        module: {
            loaders: [
                { test: /\.tsx?$/, loader: "ts-loader" }
            ],

            preLoaders: isProd ? [] : [
                { test: /\.js$/, loader: "source-map-loader" }
            ]
        },

        plugins: plugins,

        // When importing a module whose path matches one of the following, just
        // assume a corresponding global variable exists and use that instead.
        // This is important because it allows us to avoid bundling all of our
        // dependencies, which allows browsers to cache those libraries between builds.
        externals: {
            "react": "React",
            "react-dom": "ReactDOM"
        },
        devServer: {

            port: 8080,
            open: true,
            colors: true,
            contentBase: "app/",
            proxy: proxy
        }
    },


    // ####### SASS Configuration #######
    // ##################################
    {
        name: "css",
        entry: [ "./src/styles/index.scss" ],
        output: {
            path: "app/",
            filename: targetFolder + "style.css"
        },
        module: {
            loaders: [
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract("css!sass")
                }
            ]
        },
        plugins: [
            // Required for creating a separate css file rather than mashing css and js into one horrible file
            new ExtractTextPlugin(targetFolder + "style.css")
        ]
    }
];
