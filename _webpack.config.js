var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: 'eval-source-map',
    entry: [
        // 'webpack-hot-middleware/client',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        // publicPath: './dist'
        publicPath: 'http://localhost:8080/dist/'
    },
    plugins: [
        // new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loaders: ['babel'],
            exclude: /node_modules/,
            include: __dirname
        }, {
            test: /\.less?$/,
            loaders: [
                'style-loader',
                'css-loader',
                'less-loader?{"sourceMap":true}'
            ],
            include: __dirname
        }, {
            test: /\.(jpe?g|png|gif|svg)$/,
            loader: 'url',
            query: {
                limit: 10240
            }
        }]
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true
    }
}
