import api from '../../../api'
import types from './chartType'

export const getHotel = (params) => ({
    type: types.GET_HOTEL,
    payload: api.post('/minibar/machine/hotel/list', params)
});

export const getActivityData = (params) => ({
    type: types.GET_ACTIVITY_DATA,
    payload: api.get('/minibar/task/data/list', params)
});

export const getGlobalData = (params) => ({
    type: types.GET_GLOBAL_DATA,
    payload: api.get('/minibar/data/tmpl/get', params)
});

export const getStatisData = (params) => ({
    type: types.GET_STATIS_DATA,
    payload: api.get('/minibar/data/tmpl/get', params)
});

export const getTrendData = (params) => ({
    type: types.GET_TREND_DATA,
    payload: api.get('/minibar/data/tmpl/get', params)
});

export const getGoodsViewData = (params) => ({
    type: types.GET_GOODS_VIEW_DATA,
    payload: api.get('/minibar/data/tmpl/get', params)
});

export const getGoodsPayData = (params) => ({
    type: types.GET_GOODS_PAY_DATA,
    payload: api.get('/minibar/data/tmpl/get', params)
});

export const getGoodsAmountData = (params) => ({
    type: types.GET_GOODS_AMOUNT_DATA,
    payload: api.get('/minibar/data/tmpl/get', params)
});
