var webpack = require("webpack");                                               // webpack
var WebpackDevServer = require("webpack-dev-server");                           // webpack-dev-server
var config = require("./webpack.config.js");                                    // webpack的配置

var compiler = webpack(config);

var server = new WebpackDevServer(compiler, {
    contentBase: './dist',                                                      // 将运行目录设置为dist目录
    publicPath: config.output.publicPath,                                       // 和webpack中的设置保持一致
    hot: true,                                                                  // 模块热替换
    historyApiFallback: true,                                                   // 如果用browserHistory方式路由的话要加
    stats: { colors: true }                                                     // 控制台显示彩色
})

server.listen(8000, 'localhost', function(err, result) {                        // 设置端口
    if (err) {
        console.log(err);
    }
    console.log('Listening at localhost:8000');
});
