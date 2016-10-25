const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'eval-source-map',
    entry: {
        app: ['./src/index'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/assets/',
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
            loader: 'style!css!less',
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
        new webpack.HotModuleReplacementPlugin()
    ]
}
