'use strict';

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var CleanPlugin = require('clean-webpack-plugin');

var isProduction = process.env.NODE_ENV === 'production';

var entryPath = ['./src/index'];
var outputDir = path.resolve(__dirname, 'dist');

var plugins = [
    new HtmlWebpackPlugin({
        title: 'minibar',
        template: './src/index.html'
    }),
    new webpack.ProvidePlugin({
        _ : 'lodash'
    })
]

if (isProduction) {
    plugins.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new ExtractTextPlugin('[name].[contenthash:8].css', {
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor', '[name].[chunkhash:8].js'),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        }),
        new WebpackMd5Hash(),
        new CleanPlugin(outputDir)
    )
} else {
    entryPath.unshift(
        "webpack-dev-server/client?http://localhost:8000/",
        "webpack/hot/dev-server"
    )

    plugins.push(
        new webpack.optimize.CommonsChunkPlugin('vendor', '[name].js'),
        new webpack.HotModuleReplacementPlugin()
    )
}

var config = {
    entry: {
        app: entryPath,
        vendor: [
            'react',
            'react-dom',
            'react-router',
            'react-redux',
            'redux',
            'redux-thunk',
            'lodash',
            'pubsub-js'
        ]
    },
    output: {
        path: outputDir,
        filename: isProduction ? '[name].[chunkhash:8].js' : '[name].js',
        publicPath: isProduction ? 'http://boss.minibar.mockuai.com/' : 'http://localhost:8000/'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            include: __dirname
        }, {
            test: /\.less$/,
            loader: isProduction ? ExtractTextPlugin.extract('style', 'css!less') : 'style!css!less',
            include: __dirname
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url',
            query: {
                limit: 8192
            }
        }]
    },
    plugins: plugins,
    resolve: {
        extensions: ['', '.js']
    },
    devtool: isProduction ? null : 'eval-source-map'
}

module.exports = config;
