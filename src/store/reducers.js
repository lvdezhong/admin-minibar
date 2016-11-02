import { combineReducers } from 'redux'

import user from './modules/user/userReducer'
import menu from './modules/menu/menuReducer'
import device from './modules/device/deviceReducer'
import maintpl from './modules/maintpl/maintplReducer'
import goods from './modules/goods/goodsReducer'
import order from './modules/order/orderReducer'
import gift from './modules/gift/giftReducer'

export default combineReducers({
    user,
    menu,
    device,
    maintpl,
    goods,
    order,
    gift
});
