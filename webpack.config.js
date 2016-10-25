const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: false,
    entry: {
        app: ['./src/index'],
        vendor: ['react', 'react-dom']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    resolve: {
        extensions: ['', '.js']
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
    plugins:[
        new HtmlWebpackPlugin({
            title: 'minibar',
            template: 'index.html'
        }),
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
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
        new ExtractTextPlugin('[name].bundle.css', {
            allChunks: true
        })
    ]
}
