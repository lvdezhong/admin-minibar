import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRedirect, Redirect, browserHistory } from 'react-router'

import configureStore from './store'

import App from './views/App'
import Login from './views/Login'

import DeviceList from './views/Device/List'
import DeviceDetail from './views/Device/Detail'

import MainTplList from './views/MainTpl/List'
import MainTplDetail from './views/MainTpl/Detail'

import GoodsList from './views/Goods/List'
import GoodsDetail from './views/Goods/Detail'

import GiftList from './views/Gift/List'
import GiftDetail from './views/Gift/Detail'

import OrderList from './views/Order/List'

import TaskList from './views/Task/List'
import TaskNew from './views/Task/New'
import TaskDetail from './views/Task/Detail'

import ActivityChart from './views/Chart/Activity'
import TradeChart from './views/Chart/Trade'
import GoodsChart from './views/Chart/Goods'

import LogList from './views/Log/List'

import Hotel from './views/Hotel'

import WifiList from './views/Wifi/List'
import WifiDetail from './views/Wifi/Detail'

import Contact from './views/Contact'

import NewsList from './views/News/List'
import NewsDetail from './views/News/Detail'

import ServiceList from './views/Service/List'
import ServiceDetail from './views/Service/Detail'
import ServiceOrder from './views/Service/Order'

const store = configureStore();

const validate = function(next, replace) {
    const isLoggedIn = !!localStorage.getItem('uid');

    if (!isLoggedIn && next.location.pathname != '/login') {
        replace('/login')
    }
}

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" onEnter={validate}>
                <IndexRedirect to="device/list" />
                <Route path="login" component={Login} />
                <Route component={App}>
                    <Redirect from="device" to="device/list" />
                    <Route path="device/list" component={DeviceList} />
                    <Route path="device/detail/:id" component={DeviceDetail} />

                    <Redirect from="maintpl" to="maintpl/list" />
                    <Route path="maintpl/list" component={MainTplList} />
                    <Route path="maintpl/detail(/:id)" component={MainTplDetail} />

                    <Redirect from="goods" to="goods/list" />
                    <Route path="goods/list" component={GoodsList} />
                    <Route path="goods/detail(/:id)" component={GoodsDetail} />

                    <Redirect from="goods" to="gift/list" />
                    <Route path="gift/list" component={GiftList} />
                    <Route path="gift/detail(/:id)" component={GiftDetail} />

                    <Redirect from="order" to="order/list" />
                    <Route path="order/list" component={OrderList} />

                    <Redirect from="task" to="task/list" />
                    <Route path="task/list" component={TaskList} />
                    <Route path="task/new" component={TaskNew} />
                    <Route path="task/detail(/:id)(/:disabled)" component={TaskDetail} />

                    <Redirect from="chart" to="chart/trade" />
                    <Route path="chart/activity/:id" component={ActivityChart} />
                    <Route path="chart/trade" component={TradeChart} />
                    <Route path="chart/goods" component={GoodsChart} />

                    <Route path="log/list" component={LogList} />

                    <Redirect from="wifi" to="wifi/list" />
                    <Route path="hotel" component={Hotel} />
                    <Route path="wifi/list" component={WifiList} />
                    <Route path="wifi/detail(/:id)" component={WifiDetail} />

                    <Route path="contact" component={Contact} />

                    <Redirect from="news" to="news/list" />
                    <Route path="news/list" component={NewsList} />
                    <Route path="news/detail(/:id)" component={NewsDetail} />

                    <Redirect from="service" to="service/list" />
                    <Route path="service/list" component={ServiceList} />
                    <Route path="service/detail(/:id)" component={ServiceDetail} />
                    <Route path="service/order(/:id)" component={ServiceOrder} />
                </Route>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);
