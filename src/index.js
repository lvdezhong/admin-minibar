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

import OrderList from './views/Order/List'

import Chart from './views/Chart'

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
                <Route path="login" component={Login}/>
                <Route component={App}>
                    <Redirect from="device" to="device/list" />
                    <Route path="device/list" component={DeviceList}/>
                    <Route path="device/detail/:id" component={DeviceDetail}/>

                    <Redirect from="maintpl" to="maintpl/list" />
                    <Route path="maintpl/list" component={MainTplList}/>
                    <Route path="maintpl/detail(/:id)" component={MainTplDetail}/>

                    <Redirect from="goods" to="goods/list" />
                    <Route path="goods/list" component={GoodsList}/>
                    <Route path="goods/detail(/:id)" component={GoodsDetail}/>

                    <Redirect from="order" to="order/list" />
                    <Route path="order/list" component={OrderList}/>

                    <Route path="chart" component={Chart}/>
                </Route>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);
