import * as deviceAction from './modules/device/deviceAction'
import * as maintplAction from './modules/maintpl/maintplAction'
import * as goodsAction from './modules/goods/goodsAction'
import * as orderAction from './modules/order/orderAction'
import * as menuAction from './modules/menu/menuAction'
import * as userAction from './modules/user/userAction'
import * as giftAction from './modules/gift/giftAction'

export default {
  ...deviceAction,
  ...maintplAction,
  ...goodsAction,
  ...orderAction,
  ...menuAction,
  ...userAction,
  ...giftAction
}
