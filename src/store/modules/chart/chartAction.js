import api from '../../../api'
import types from './chartType'

export const getHotel = (params) => ({
    type: types.GET_HOTEL,
    payload: api.post('/minibar/machine/hotel/list', params)
});

export const getActivityPartData = (params) => ({
    type: types.GET_ACTIVITY_PART_DATA,
    payload: api.get('/minibar/data/tmpl/get', params)
});

export const getActivityLiveData = (params) => ({
    type: types.GET_ACTIVITY_LIVE_DATA,
    payload: api.get('/minibar/data/tmpl/get', params)
});

export const getActivityRatioData = (params) => ({
    type: types.GET_ACTIVITY_RATIO_DATA,
    payload: api.get('/minibar/data/tmpl/get', params)
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
