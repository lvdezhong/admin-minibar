import { combineReducers } from 'redux'

import user from './modules/user/userReducer'
import menu from './modules/menu/menuReducer'
import device from './modules/device/deviceReducer'
import maintpl from './modules/maintpl/maintplReducer'
import goods from './modules/goods/goodsReducer'
import order from './modules/order/orderReducer'
import gift from './modules/gift/giftReducer'
import task from './modules/task/taskReducer'
import chart from './modules/chart/chartReducer'
import log from './modules/log/logReducer'
import hotel from './modules/hotel/hotelReducer'
import wifi from './modules/wifi/wifiReducer'
import contact from './modules/contact/contactReducer'
import news from './modules/news/newsReducer'

export default combineReducers({
    user,
    menu,
    device,
    maintpl,
    goods,
    order,
    gift,
    task,
    chart,
    log,
    hotel,
    wifi,
    contact,
    news
});
