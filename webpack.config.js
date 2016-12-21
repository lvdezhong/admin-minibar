'use strict';

var webpack = require('webpack');                                               // webpack
var path = require('path');                                                     // node的path模块
var ExtractTextPlugin = require('extract-text-webpack-plugin');                 // 提取css
var HtmlWebpackPlugin = require('html-webpack-plugin');                         // html模版
var WebpackMd5Hash = require('webpack-md5-hash');                               // hash
var CleanPlugin = require('clean-webpack-plugin');                              // 清空dist文件夹

var isProduction = process.env.NODE_ENV === 'production';                       // 用isProduction来区分环境

var entryPath = ['./src/index'];                                                // 入口
var outputDir = path.resolve(__dirname, 'dist');                                // 输出的文件夹

var plugins = [
    new HtmlWebpackPlugin({                                                     // 自动加载编译后的js和css并输出到dist文件下
        title: 'minibar',
        template: './src/index.html',
        inject: true
    }),
    new webpack.ProvidePlugin({                                                 // 将lodash放到全局的window对象中
        _: 'lodash',
        $: 'jquery'
    })
]

if (isProduction) {
    plugins.push(
        new webpack.DefinePlugin({                                              // 如果在生产环境压缩了react要加上
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new ExtractTextPlugin('[name].[contenthash:8].css', {                   // 提取css并加上hash
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor', '[name].[chunkhash:8].js'), // 提取合并公共的第三方库并加上hash
        new webpack.optimize.UglifyJsPlugin({                                   // 压缩js
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        }),
        new WebpackMd5Hash(),                                                   // 防止更改css的时候js的hash被更改
        new CleanPlugin(outputDir)                                              // 打包时清空dist目录
    )
} else {
    entryPath.unshift(                                                          // 开发环境的模块热替换
        "webpack-dev-server/client?http://localhost:8000/",
        "webpack/hot/dev-server"
    )

    plugins.push(
        new webpack.optimize.CommonsChunkPlugin('vendor', '[name].js'),
        new webpack.HotModuleReplacementPlugin()                                // 开发环境的模块热替换
    )
}

var config = {
    entry: {
        app: entryPath,                                                         // 入口
        vendor: [                                                               // 要合并的第三方库
            'react',
            'react-dom',
            'react-router',
            'react-redux',
            'react-addons-css-transition-group',
            'redux',
            'redux-promise-middleware',
            'redux-thunk',
            'lodash',
            'pubsub-js',
            'mirrorkey',
            'classnames',
            'jquery',
            'wangeditor',
            'recharts'
        ]
    },
    output: {
        path: outputDir,                                                        // 输出文件夹
        filename: isProduction ? '[name].[chunkhash:8].js' : '[name].js',       // 如果是生产环境加上hash
        publicPath: '/'                                                         // 配置资源加载的路径
    },
    module: {                                                                   // 各种loader
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            include: __dirname
        }, {
            test: /\.json$/,
            loader: 'json',
            exclude: /node_modules/,
            include: __dirname
        }, {
            test: /\.less$/,
            loader: isProduction ? ExtractTextPlugin.extract('style', 'css!less') : 'style!css!less',
            include: __dirname
        }, {
            test: /\.css$/,
            loader: 'style!css',
            include: __dirname
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url?limit=8192'
        }, {
            test: /\.(woff|svg|eot|ttf)\??.*$/,
            loader: 'url?limit=50000&name=[name].[ext]'
        }]
    },
    plugins: plugins,
    resolve: {
        extensions: ['', '.js']                                                 // 引用时可以忽略文件尾缀
    },
    devtool: isProduction ? null : 'eval-source-map'                            // 生产环境开启source-map
}

module.exports = config;
