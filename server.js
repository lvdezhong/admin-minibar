var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var config = require("./webpack.dev.config.js");

config.entry.app.unshift("webpack-dev-server/client?http://localhost:8000/", "webpack/hot/dev-server");

var compiler = webpack(config);

var server = new WebpackDevServer(compiler, {
    contentBase: './dist',
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: { colors: true }
})

server.listen(8000, '127.0.0.1', function(err, result) {
    if (err) {
        console.log(err);
    }
    console.log('Listening at 127.0.0.1:8000');
});
