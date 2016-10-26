'use strict';

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var isProduction = process.env.NODE_ENV === 'production';

var outputDir = path.resolve(__dirname, 'dist');
var entryPath = ['./src/index'];

var plugins = [
    new HtmlWebpackPlugin({
        title: 'minibar',
        template: 'index.html'
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new ExtractTextPlugin('[name].bundle.css', {
        allChunks: true
    })
]

if (isProduction) {
    plugins.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        })
    )
} else {
    entryPath.unshift(
        "webpack-dev-server/client?http://localhost:8000/",
        "webpack/hot/dev-server"
    )

    plugins.push(
        new webpack.HotModuleReplacementPlugin()
    )
}

var config = {
    entry: {
        app: entryPath,
        vendor: ['react', 'react-dom']
    },
    output: {
        path: outputDir,
        filename: '[name].bundle.js',
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
            loader: ExtractTextPlugin.extract('style', 'css!less'),
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
