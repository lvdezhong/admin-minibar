import api from '../../../api'

export const GET_ORDER = 'GET_ORDER';
export const GET_ORDER_PENDING = 'GET_ORDER_PENDING';
export const GET_ORDER_SUCCESS = 'GET_ORDER_SUCCESS';
export const GET_ORDER_ERROR = 'GET_ORDER_ERROR';

export const getOrder = (params) => ({
    type: GET_ORDER,
    payload: api.get('/minibar/trade/seller_order/list', params)
})
