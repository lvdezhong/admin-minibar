require('babel-register')

const webpack = require('webpack');

const express = require('express');
const path = require('path');
// const bodyParser = require('body-parser');
const config = require('./webpack.config');

const isProduction = process.env.NODE_ENV === 'production';
const isDeveloping = !isProduction;

const app = express();

// Webpack developer
if (isDeveloping) {
    const compiler = webpack(config);
    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: config.output.publicPath,
        noInfo: true
    }));

    app.use(require('webpack-hot-middleware')(compiler));
}

//  RESTful API
// const publicPath = path.resolve(__dirname);
// app.use(bodyParser.json({
//     type: 'application/json'
// }))
// app.use(express.static(publicPath));

const port = isProduction ? (process.env.PORT || 80) : 3000;

// this is necessary to handle URL correctly since client uses Browser History
app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '', 'index.html'))
})
//
// app.put('/api/login', function(req, res) {
//     const credentials = req.body;
//     if (credentials.user === 'admin' && credentials.password === '123456') {
//         // res.cookie('uid', '1', {domain:'localhost:3000'});
//         res.cookie('uid', '1');
//         res.json({
//             'user': credentials.user,
//             'role': 'ADMIN',
//             'uid': 1
//         });
//     } else {
//         res.status('500').send({
//             'message': 'Invalid user/password'
//         });
//     }
// });
//
// app.post('/api/menu', function(req, res) {
//     res.json({
//         menus: [{
//             key: 1,
//             name: '设备',
//             icon: 'user',
//             child: [{
//                 name: '设备管理',
//                 key: 101,
//                 link: '/device/list'
//             }, {
//                 name: '主页模版',
//                 key: 102,
//                 link: '/maintpl/list'
//             }]
//         }, {
//             key: 2,
//             name: '商品',
//             icon: 'laptop',
//             child: [{
//                 name: '商品库',
//                 key: 201,
//                 link: '/goods/list'
//             }]
//         }, {
//             key: 3,
//             name: '交易',
//             icon: 'notification',
//             child: [{
//                 name: '订单',
//                 key: 301,
//                 link: '/order/list'
//             }]
//         }]
//     });
// });
//
// app.post('/api/my', function(req, res) {
//     res.json({
//         'user': 'admin',
//         'role': 'ADMIN',
//         'uid': 1
//     });
// });
//
// app.post('/api/logout', function(req, res) {
//     res.clearCookie('uid');
//     res.json({
//         'user': 'admin',
//         'role': 'ADMIN'
//     });
// });
//
// app.post('/api/device', function(req, res) {
//     res.json({
//         machine_list: [{
//             machine_sn: 1,
//             status: 0,
//             tmpl_id: 1,
//             hotel: {
//                 id: 1,
//                 name: '如家快捷酒店1',
//                 address: '德信北海公园1',
//                 room_number: '110',
//                 longitude: '',
//                 latitude: ''
//             },
//             machine_item_list: []
//         }, {
//             machine_sn: 2,
//             status: 1,
//             tmpl_id: 2,
//             hotel: {
//                 id: 2,
//                 name: '如家快捷酒店2',
//                 address: '德信北海公园2',
//                 room_number: '250',
//                 longitude: '',
//                 latitude: ''
//             },
//             machine_item_list: []
//         }],
//         total_count: 2
//     });
// });
//
// app.post('/api/device/item', function(req, res) {
//     res.json({
//         machine: {
//             machine_sn: 1,
//             status: 1,
//             tmpl_id: 1,
//             hotel: {
//                 id: 1,
//                 name: '如家快捷酒店1',
//                 address: '德信北海公园1',
//                 room_number: '110',
//                 longitude: '',
//                 latitude: ''
//             },
//             machine_item_list: [{
//                 id: 1,
//                 name: "测试商品1",
//                 machine_id: 1,
//                 category_id: 1,
//                 category_name: "测试类目名称1",
//                 image_horizontal: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//                 image_vertical: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//                 origin_price: 10000,
//                 price: 100,
//                 status: 0,
//                 stock_num: 9,
//                 max_stock_num: 9
//             }, {
//                 id: 2,
//                 name: "测试商品2",
//                 machine_id: 1,
//                 category_id: 1,
//                 category_name: "测试类目名称2",
//                 image_horizontal: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//                 image_vertical: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//                 origin_price: 10000,
//                 price: 100,
//                 status: 0,
//                 stock_num: 99,
//                 max_stock_num: 99
//             }, {
//                 id: 3,
//                 name: "测试商品3",
//                 machine_id: 1,
//                 category_id: 1,
//                 category_name: "测试类目名称3",
//                 image_horizontal: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//                 image_vertical: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//                 origin_price: 10000,
//                 price: 100,
//                 status: 0,
//                 stock_num: 999,
//                 max_stock_num: 999
//             }, {
//                 id: 4,
//                 name: "测试商品4",
//                 machine_id: 1,
//                 category_id: 1,
//                 category_name: "测试类目名称4",
//                 image_horizontal: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//                 image_vertical: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//                 origin_price: 10000,
//                 price: 100,
//                 status: 0,
//                 stock_num: 9999,
//                 max_stock_num: 9999
//             }, {
//                 id: 5,
//                 name: "测试商品5",
//                 machine_id: 1,
//                 category_id: 1,
//                 category_name: "测试类目名称5",
//                 image_horizontal: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//                 image_vertical: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//                 origin_price: 10000,
//                 price: 100,
//                 status: 0,
//                 stock_num: 9999,
//                 max_stock_num: 99999
//             }, {
//                 id: 6,
//                 name: "测试商品6",
//                 machine_id: 1,
//                 category_id: 1,
//                 category_name: "测试类目名称6",
//                 image_horizontal: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//                 image_vertical: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//                 origin_price: 10000,
//                 price: 100,
//                 status: 0,
//                 stock_num: 999999,
//                 max_stock_num: 999999
//             }, {
//                 id: 7,
//                 name: "测试商品7",
//                 machine_id: 1,
//                 category_id: 1,
//                 category_name: "测试类目名称7",
//                 image_horizontal: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//                 image_vertical: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//                 origin_price: 10000,
//                 price: 100,
//                 status: 0,
//                 stock_num: 9999999,
//                 max_stock_num: 9999999
//             }]
//         }
//     });
// });
//
// app.post('/api/maintpl', function(req, res) {
//     res.json({
//         machine_tmpl_list: [{
//             id: 1,
//             name: '模版1',
//             gmt_create: '2016-10-01',
//             tmpl_item_list: []
//         }, {
//             id: 2,
//             name: '模版2',
//             gmt_create: '2016-10-01',
//             tmpl_item_list: []
//         }]
//     });
// });
//
// app.post('/api/maintpl/item', function(req, res) {
//     res.json({
//         machine_tmpl: {
//             tmpl_id: 1,
//             name: '模版1',
//             tmpl_item_list: []
//         }
//     });
// });
//
// app.post('/api/goods', function(req, res) {
//     res.json({
//         item_list: [{
//             id: 1,
//             name: '商品1',
//             image_horizontal: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//             image_vertical: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//             origin_price: 100
//         }, {
//             id: 2,
//             name: '商品2',
//             image_horizontal: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//             image_vertical: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//             origin_price: 10000
//         }],
//         total_count: 2
//     });
// });
//
// app.post('/api/goods/item', function(req, res) {
//     res.json({
//         item: {
//             id: 1,
//             name: '商品1',
//             image_horizontal: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//             image_vertical: "https://placeholdit.imgix.net/~text?txtsize=14&txt=100%C3%97100&w=100&h=100",
//             origin_price: 100,
//             category_id: 1
//         }
//     });
// });
//
// app.post('/api/order', function(req, res) {
//     res.json({
//         order_item_list: [{
//             goods: 1,
//             price_num: 1,
//             buyer: 1,
//             pay_type: 1,
//             price: 1,
//             state: 1
//         }, {
//             goods: 2,
//             price_num: 2,
//             buyer: 2,
//             pay_type: 2,
//             price: 2,
//             state: 2
//         }]
//     });
// });

app.listen(port, function(err, result) {
    if (err) {
        console.log(err);
    }
    console.log('Server running on port ' + port);
});
