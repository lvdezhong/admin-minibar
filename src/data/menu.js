const data = [{
    "key": 1,
    "name": "设备",
    "icon": "laptop",
    "child": [{
        "name": "设备管理",
        "key": 101,
        "link": "/device/list"
    }, {
        "name": "主页模版",
        "key": 102,
        "link": "/maintpl/list"
    }]
}, {
    "key": 2,
    "name": "商品",
    "icon": "shopping-cart",
    "child": [{
        "name": "商品库",
        "key": 201,
        "link": "/goods/list"
    }, {
        "name": "赠品库",
        "key": 202,
        "link": "/gift/list"
    }]
}, {
    "key": 3,
    "name": "交易",
    "icon": "pay-circle-o",
    "child": [{
        "name": "订单",
        "key": 301,
        "link": "/order/list"
    }]
}, {
    "key": 4,
    "name": "微任务",
    "icon": "bars",
    "child": [{
        "name": "免费送",
        "key": 401,
        "link": "/task/list"
    }]
}]

export default data;
