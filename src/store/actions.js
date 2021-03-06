import * as deviceAction from './modules/device/deviceAction'
import * as maintplAction from './modules/maintpl/maintplAction'
import * as goodsAction from './modules/goods/goodsAction'
import * as orderAction from './modules/order/orderAction'
import * as menuAction from './modules/menu/menuAction'
import * as userAction from './modules/user/userAction'
import * as giftAction from './modules/gift/giftAction'
import * as taskAction from './modules/task/taskAction'
import * as chartAction from './modules/chart/chartAction'
import * as logAction from './modules/log/logAction'
import * as hotelAction from './modules/hotel/hotelAction'
import * as wifiAction from './modules/wifi/wifiAction'
import * as contactAction from './modules/contact/contactAction'
import * as newsAction from './modules/news/newsAction'
import * as serviceAction from './modules/service/serviceAction'

export default {
    ...deviceAction,
    ...maintplAction,
    ...goodsAction,
    ...orderAction,
    ...menuAction,
    ...userAction,
    ...giftAction,
    ...taskAction,
    ...chartAction,
    ...logAction,
    ...hotelAction,
    ...wifiAction,
    ...contactAction,
    ...newsAction,
    ...serviceAction
}
